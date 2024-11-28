import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pokemon: defineTable({
    name: v.string(),
    dexId: v.number(),
  }),
  votes: defineTable({
    votedForId: v.id("pokemon"),
    votedAgainstId: v.id("pokemon"),
  }),
  tallies: defineTable({
    pokemonId: v.id("pokemon"),
    winPercentage: v.number(),
    upVotes: v.number(),
    downVotes: v.number(),
  }).index("by_tally", ["winPercentage", "upVotes"])
  .index("by_pokemon", ["pokemonId"])
  ,
});
