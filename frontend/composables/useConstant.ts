import { genderList,visitTypeList,StatusList } from "~/constants"
export const useConstant = () => {
    function gender (value?:string) {
        if (value) {
            return genderList.find(resp => resp.value === value)
        }
        return genderList
    }
    function visitType (value?:string) {
        if (value) {
            return visitTypeList.find(resp => resp.value === value) || []
        }
        return visitTypeList
    }
    function statusList () {
        return StatusList
    }
    return {gender,visitType,statusList}
}