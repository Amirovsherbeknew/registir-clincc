import { rules } from "~/constants/rules"
import type { rulesKeyType } from "~/types/rules.type"
export const useRules = (rulesKey:rulesKeyType) => {
    return rules[rulesKey]
}