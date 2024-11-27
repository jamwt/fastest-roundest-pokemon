import { PokemonSprite } from "~/app/utils/sprite";

import getLayout from "~/app/utils/layout";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/results")({
  component: Results,
});

function Results() {
  const data = useQuery(api.pokemon.results);

  if (!data) return <ResultsPageFallback />;

  return (
    <>
      <div className="container mx-auto px-4 py-8 text-white">
        {data.map((pokemon, index) => (
          <div
            key={pokemon._id}
            className="flex items-center gap-6 rounded-lg bg-gray-800/40 p-6 shadow transition-shadow hover:shadow-md"
          >
            <div className="w-8 text-2xl font-bold text-gray-400">
              #{index + 1}
            </div>

            <PokemonSprite dexId={pokemon.dexId} className="h-20 w-20" />

            <div className="flex-grow">
              <div className="text-sm text-gray-400">#{pokemon.dexId}</div>
              <h2 className="text-xl font-semibold capitalize">
                {pokemon.name}
              </h2>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {pokemon.tally.winPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {pokemon.tally.upVotes}W - {pokemon.tally.downVotes}L
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ResultsPageFallback() {
  return (
    <>
      {[...Array<number>(10)].map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-6 rounded-lg bg-gray-800/40 p-6 shadow"
        >
          <div className="h-8 w-8 rounded bg-gray-700/40" />
          <div className="h-20 w-20 rounded bg-gray-700/40" />
          <div className="flex-grow">
            <div className="mb-2 h-4 w-16 rounded bg-gray-700/40" />
            <div className="h-6 w-32 rounded bg-gray-700/40" />
          </div>
          <div className="text-right">
            <div className="mb-2 h-8 w-16 rounded bg-gray-700/40" />
            <div className="h-4 w-24 rounded bg-gray-700/40" />
          </div>
        </div>
      ))}
    </>
  );
}
export default Route;
