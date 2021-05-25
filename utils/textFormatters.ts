export const formatErrors = (errorList: any) => {
    const errorContent = Object.keys(errorList).map(key => ({
        key,
        value: errorList[key]
    }))

    const formattedError: Array<any> = errorContent.map(name => {
        return `${name.key}: ${name.value.join(", ")}`
    })

    return formattedError.join(", ")
}