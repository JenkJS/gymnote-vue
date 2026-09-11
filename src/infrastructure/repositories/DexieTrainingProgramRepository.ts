import type { TrainingProgram } from '@/domain/program/types'
import { gymnoteDatabase } from '@/infrastructure/database/gymnoteDatabase'
import type { TrainingProgramRepository } from '@/repositories/trainingProgramRepository'

export class DexieTrainingProgramRepository implements TrainingProgramRepository {
  async getPrograms(): Promise<TrainingProgram[]> {
    const programs = await gymnoteDatabase.trainingPrograms.toArray()

    return programs
      .filter((program) => program.deletedAt === null)
      .sort((firstProgram, secondProgram) => firstProgram.name.localeCompare(secondProgram.name))
  }

  async getProgramById(id: string): Promise<TrainingProgram | undefined> {
    const program = await gymnoteDatabase.trainingPrograms.get(id)

    if (!program || program.deletedAt !== null) {
      return undefined
    }

    return program
  }

  async saveProgram(program: TrainingProgram): Promise<void> {
    await gymnoteDatabase.trainingPrograms.put(program)
  }

  async savePrograms(programs: TrainingProgram[]): Promise<void> {
    if (programs.length === 0) {
      return
    }

    await gymnoteDatabase.trainingPrograms.bulkPut(programs)
  }
}

export const trainingProgramRepository = new DexieTrainingProgramRepository()
