export default {
    "Townsfolk":              {color: "#55a630"},
    "Kingdom's Army":         {color: "#e63946", group: "Military"},
    "The Arcane Association": {color: "#C71585", group: "Arcane",
                               requirement: [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}], },

    "Fundamentals": {color: "#4a4e69"},
    "Combat":       {color: "#ff704d"},
    "Magic":        {color: "#875F9A"},
    "Dark magic":   {color: "#73000f",
                     requirement: [{rebirthEvil: 1}], },

    "Properties": {color: "#219ebc", unique: true},
    "Furniture":  {color: "#71492b"},
    "Personnel":  {color: "#b56576"},

    "Evil":  {color: "#c80000"},
}