import { prisma } from "./client";

async function main() {
  for (let name of ["HIIT", "Warm Up", "Rope Skipping"]) {
    const result = await prisma.exercise.create({
      data: {
        name,
      },
    });
  }
}

main();
