import type { TrainingProgram } from '@/domain/program/types'

export interface TrainingProgramRepository {
  getPrograms(): Promise<TrainingProgram[]>
  getProgramById(id: string): Promise<TrainingProgram | undefined>
  saveProgram(program: TrainingProgram): Promise<void>
  savePrograms(programs: TrainingProgram[]): Promise<void>
}
