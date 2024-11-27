import { TableAggregate } from "@convex-dev/aggregate";
import { components, internal } from "./_generated/api";
import type { DataModel, Doc, Id } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  mutation,
  MutationCtx,
  query,
} from "./_generated/server";
import { v } from "convex/values";

export const getPair = query({
  args: { randomSeed: v.number() },
  handler: async (ctx): Promise<[Doc<"pokemon">, Doc<"pokemon">]> => {
    const first = await randomPokemonAggregate.random(ctx);

    let second = first;
    while (second === first) {
      second = await randomPokemonAggregate.random(ctx);
    }
    return [(await ctx.db.get(first!.id))!, (await ctx.db.get(second!.id))!];
  },
});

export const vote = mutation({
  args: { voteFor: v.id("pokemon"), voteAgainst: v.id("pokemon") },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("votes", {
      votedForId: args.voteFor,
      votedAgainstId: args.voteAgainst,
    });
    await updateTally(ctx, args.voteFor, true);
    await updateTally(ctx, args.voteAgainst, false);
  },
});

async function updateTally(
  ctx: MutationCtx,
  pokemonId: Id<"pokemon">,
  win: boolean
) {
  const pokemon = await ctx.db.get(pokemonId);
  let tallyOverrides = pokemon!.tally;
  if (win) {
    tallyOverrides.upVotes++;
  } else {
    tallyOverrides.downVotes++;
  }
  tallyOverrides.winPercentage =
    (tallyOverrides.upVotes /
      (tallyOverrides.upVotes + tallyOverrides.downVotes)) *
    100;
  await ctx.db.patch(pokemonId, {
    tally: tallyOverrides,
  });
}

export const results = query({
  handler: async (ctx) => {
    return ctx.db
      .query("pokemon")
      .withIndex("by_tally")
      .order("desc")
      .collect();
  },
});

const randomPokemonAggregate = new TableAggregate<{
  Namespace: undefined;
  Key: null;
  DataModel: DataModel;
  TableName: "pokemon";
}>(components.randomPokemonAggregate, {
  namespace: () => undefined,
  sortKey: () => null,
});

//////  INIT STUFF BELOW
export const addPokemon = internalMutation({
  args: { pokemon: v.array(v.object({ name: v.string(), dexId: v.number() })) },
  handler: async (ctx, args) => {
    for (const p of args.pokemon) {
      const id = await ctx.db.insert("pokemon", {
        name: p.name,
        dexId: p.dexId,
        tally: { winPercentage: 0, upVotes: 0, downVotes: 0 },
      });
      const doc = await ctx.db.get(id);
      await randomPokemonAggregate.insert(ctx, doc!);
    }
  },
});

// Just run this in the Convex dashboard.
export const initDatabase = internalAction({
  args: {},
  handler: async (ctx) => {
    const allPokemon = await getAllPokemon();

    const formattedPokemon = allPokemon.map((p) => ({
      dexId: p.dexNumber,
      name: p.name,
    }));

    for (let i = 0; i < formattedPokemon.length; i += 100) {
      const batch = formattedPokemon.slice(i, i + 100);
      await ctx.runMutation(internal.pokemon.addPokemon, {
        pokemon: batch,
      });
    }
  },
});

/**
 * Fetches all Pokemon from Gen 1-9 (up to #1025) from the PokeAPI GraphQL endpoint.
 * Each Pokemon includes their name, Pokedex number, and sprite URL.
 * Results are cached indefinitely using Next.js cache.
 */
async function getAllPokemon() {
  // Use the graphql endpoint because the normal one won't let you get names
  // in a single query
  const query = `
    query GetAllPokemon {
      pokemon_v2_pokemon(where: {id: {_lte: 1025}}) {
        id
        pokemon_v2_pokemonspecy {
          name
        }
      }
    }
  `;

  const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = (await response.json()).data as {
    pokemon_v2_pokemon: {
      id: number;
      pokemon_v2_pokemonspecy: {
        name: string;
      };
    }[];
  };

  return data.pokemon_v2_pokemon.map((pokemon) => ({
    name: pokemon.pokemon_v2_pokemonspecy.name,
    dexNumber: pokemon.id,
  }));
}

const doBackfill = async () => {};
