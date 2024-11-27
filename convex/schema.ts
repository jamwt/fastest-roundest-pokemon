import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pokemon: defineTable({
    name: v.string(),
    dexId: v.number(),
    tally: v.object({
      winPercentage: v.number(),
      upVotes: v.number(),
      downVotes: v.number(),
    }),
  }).index("by_tally", ["tally.winPercentage", "tally.upVotes"]),
  votes: defineTable({
    votedForId: v.id("pokemon"),
    votedAgainstId: v.id("pokemon"),
  }),
});
