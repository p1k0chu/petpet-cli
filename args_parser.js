
function print_help() {
    console.log(`Usage:
${process.argv[1]} -o output input

args:
-o : path to output gif file
input: path to input image
`)
}


export function parse() {
    const args = process.argv.slice(2)

    const params = {
        inputFile: undefined,
        outputFile: undefined
    }
    let state = null;
    for (let arg of args) {
        switch (arg) {
            case "-h":
            case "--help":
                print_help()
                process.exit()
            case "-o":
                state = "output"
                break;
            default:
                switch (state) {
                    case "output":
                        params.outputFile = arg
                        break;
                    default:
                        params.inputFile = arg
                        break;
                }
                state = null
                break;
        }
    }

    const nullKey = findNull(params)
    if (nullKey == null) return params

    throw new Error("Missing argument: " + nullKey)
}

function findNull(obj) {
    for (let [key, value] of Object.entries(obj)) {
        if (value == null) return key
    }
    return null
}

