export function translateExpressionToEmoji(expression: string){

    switch(expression){
        case "happy":
      return '😊'; // emoji for happy face
    case "sad":
      return '🙁'; // emoji for sad face
    case "angry":
      return '😡'; // emoji for angry face
    case "surprised":
      return '😲'; // emoji for surprised face
    case "neutral":
      return '😐'; // emoji for neutral face
    case "fearful":
        return '😨'
    case "disgusted":
        return '🤢'
    default:
      return '😐'; // emoji for neutral face if expression is not recognized
    }
}
