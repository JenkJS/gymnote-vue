import { onMounted, ref } from 'vue'

import type { TrainingProgram } from '@/domain/program/types'
import { trainingProgramRepository } from '@/infrastructure/repositories/DexieTrainingProgramRepository'
import type { TrainingProgramRepository } from '@/repositories/trainingProgramRepository'
import {
  parseTrainingProgramFile,
  type TrainingProgramParseResult,
} from '@/domain/program/parseTrainingProgramFile'

type ParseError = Exclude<TrainingProgramParseResult, { ok: true }>

export type TrainingProgramImportError =
  ParseError | { ok: false; reason: 'fileReadFailed' | 'saveFailed' }

export function useTrainingPrograms(
  repository: TrainingProgramRepository = trainingProgramRepository,
) {
  const programs = ref<TrainingProgram[]>([])
  const isLoading = ref(true)
  const hasLoadError = ref(false)
  const isImporting = ref(false)
  const importError = ref<TrainingProgramImportError | null>(null)
  const importedProgramCount = ref(0)

  async function loadPrograms() {
    isLoading.value = true
    hasLoadError.value = false

    try {
      programs.value = await repository.getPrograms()
    } catch {
      hasLoadError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function importPrograms(file: File): Promise<boolean> {
    isImporting.value = true
    importError.value = null
    importedProgramCount.value = 0

    try {
      let fileContent: string

      try {
        fileContent = await file.text()
      } catch {
        importError.value = {
          ok: false,
          reason: 'fileReadFailed',
        }

        return false
      }

      const parseResult = parseTrainingProgramFile(fileContent)

      if (!parseResult.ok) {
        importError.value = parseResult
        return false
      }

      try {
        await repository.savePrograms(parseResult.programs)
        importedProgramCount.value = parseResult.programs.length
        await loadPrograms()

        return true
      } catch {
        importError.value = {
          ok: false,
          reason: 'saveFailed',
        }

        return false
      }
    } finally {
      isImporting.value = false
    }
  }

  onMounted(() => {
    void loadPrograms()
  })

  return {
    programs,
    isLoading,
    hasLoadError,
    loadPrograms,
    isImporting,
    importError,
    importedProgramCount,
    importPrograms,
  }
}
