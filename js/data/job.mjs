export default {
    "Beggar":     {category: "Townsfolk", maxXp:   50, income:   5,
                   tooltip: "Struggle day and night for a couple of copper coins. It feels like you are at the brink of death each day.",},
    "Farmer":     {category: "Townsfolk", maxXp:  100, income:   9,
                   requirement: [{job: "Beggar", level: 10}],
                   tooltip: "Plow the fields and grow the crops. It's not much but it's honest work."},
    "Fisherman":  {category: "Townsfolk", maxXp:  200, income:  15,
                   requirement: [{job: "Farmer", level: 10}],
                   tooltip: "Reel in various fish and sell them for a handful of coins. A relaxing but still a poor paying job."},         
    "Miner":      {category: "Townsfolk", maxXp:  400, income:  40,
                   requirement: [{skill: "Strength", level: 10}, {job: "Fisherman", level: 10}],
                   tooltip: "Delve into dangerous caverns and mine valuable ores. The pay is quite meager compared to the risk involved."},
    "Blacksmith": {category: "Townsfolk", maxXp:  800, income:  80,
                   requirement: [{skill: "Strength", level: 30}, {job: "Miner", level: 10}],
                   tooltip: "Smelt ores and carefully forge weapons for the military. A respectable and OK paying commoner job."},
    "Merchant":   {category: "Townsfolk", maxXp: 1600, income: 150,
                   requirement: [{skill: "Bargaining", level: 50}, {job: "Blacksmith", level: 10}],
                   tooltip: "Travel from town to town, bartering fine goods. The job pays decently well and is a lot less manually-intensive."},

    "Squire":           {category: "Kingdom's Army", maxXp:       100, income:      5,
                         requirement: [{skill: "Strength", level: 5}],
                         tooltip:"Carry around your knight's shield and sword along the battlefield. Very meager pay but the work experience is quite valuable."},
    "Footman":          {category: "Kingdom's Army", maxXp:       500, income:     20,
                         requirement: [{skill: "Strength", level: 20}, {job: "Squire", level: 10}],
                         tooltip:"Put down your life to battle with enemy soldiers. A courageous, respectable job but you are still worthless in the grand scheme of things."},   
    "Veteran footman":  {category: "Kingdom's Army", maxXp:      2500, income:      50,
                         requirement: [{skill: "Battle tactics", level: 30}, {job: "Footman", level: 10}],
                         tooltip:"More experienced and useful than the average footman, take out the enemy forces in battle with your might. The pay is not that bad."},
    "Horseman":         {category: "Kingdom's Army", maxXp:    12500, income:     120,
                         requirement: [{skill: "Strength", level: 80}, {job: "Veteran footman", level: 10}],
                         tooltip: "Charges towards the enemy line from horse back. The extra money is great but the horse is expensive."},
    "Veteran horseman": {category: "Kingdom's Army", maxXp:    62500, income:     300,
                         requirement: [{skill: "Battle tactics", level: 50}, {job: "Horseman", level: 10}],
                         tooltip:"With better equipment and a better horse, crush enemies formation without too much of danger. The pay is better, but still inferior to a knight."},
    "Knight":           {category: "Kingdom's Army", maxXp:    300000, income:    1000,
                         requirement: [{skill: "Strength", level: 160}, {job: "Veteran horseman", level: 10}],
                         tooltip:"Slash and pierce through enemy soldiers with ease, while covered in steel from head to toe. A decently paying and very respectable job."},
    "Veteran knight":   {category: "Kingdom's Army", maxXp:   1500000, income:    3500,
                         requirement: [{skill: "Battle tactics", level: 150}, {job: "Knight", level: 10}],
                         tooltip:"Utilising your unmatched combat ability, slaugher enemies effortlessly. Most footmen in the military would never be able to acquire such a well paying job like this."},
    "Elite knight":     {category: "Kingdom's Army", maxXp:   7500000, income:   15000,
                         requirement: [{skill: "Strength", level: 320}, {job: "Veteran knight", level: 10}],
                         tooltip:"Obliterate squadrons of enemy soldiers in one go with extraordinary proficiency, while equipped with the finest gear. Such a feared unit on the battlefield is paid extremely well."},
    "Paladin":          {category: "Kingdom's Army", maxXp:  40000000, income:   75000,
                         requirement: [{skill: "Aura manipulation", level: 200}, {job: "Elite knight", level: 10}],
                         tooltip:"Collapse entire armie in mere minute with your magically imbued blade. The handful of elite knights who attain this level of power are showered with coins."},
    "Veteran Paladin":  {category: "Kingdom's Army", maxXp: 150000000, income:  400000,
                         requirement: [{skill: "Aura manipulation", level: 500}, {skill: "Battle tactics", level: 300}, {job: "Paladin", level: 10}],
                         tooltip:"Use your magical combat aura to attack multiple armies simultaneous and defeat them in a flash. The few paladins who reach this stage are paid in king's ransoms."},
    "Heavenly Paladin": {category: "Kingdom's Army", maxXp: 450000000, income: 2500000,
                         requirement: [{skill: "Strength", level: 1000}, {skill: "Aura manipulation", level: 1000}, {skill: "Battle tactics", level: 1000}, {job: "Veteran Paladin", level: 10}],
                         tooltip:"Feared worldwide, obliterate entire nations in a blink of an eye. Roughly every century, only one paladin is worthy of receiving such an esteemed title."},

    "Student":         {category: "The Arcane Association", maxXp:        100000, income:     100,
                        requirement: [{skill: "Concentration", level: 200}, {skill: "Meditation", level: 200}],
                        tooltip:"Study the theory of mana and practice basic spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a mage."},
    "Apprentice mage": {category: "The Arcane Association", maxXp:       1000000, income:    1000,
                        requirement: [{skill: "Mana control", level: 400}, {job: "Student", level: 10}],
                        tooltip:"Under the supervision of a mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs."},
    "Mage":            {category: "The Arcane Association", maxXp:      10000000, income:    7500,
                        requirement: [{skill: "Mana control", level: 700}, {job: "Apprentice mage", level: 10}],
                        tooltip:"Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high."},
    "Wizard":          {category: "The Arcane Association", maxXp:     100000000, income:   50000,
                        requirement: [{skill: "Mana control", level: 1000}, {job: "Mage", level: 10}],
                        tooltip:"Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay."},
    "Master wizard":   {category: "The Arcane Association", maxXp:   10000000000, income:  250000,
                        requirement: [{skill: "Mana control", level: 1500}, {job: "Wizard", level: 10}],
                        tooltip:"Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that a master wizard has enough destructive power to wipe an empire off the map."},
    "Chairman":        {category: "The Arcane Association", maxXp: 1000000000000, income: 1000000,
                        requirement: [{skill: "Mana control", level: 2000}, {job: "Master wizard", level: 10}],
                        tooltip:"Spend your days administrating The Arcane Association and investigate the concepts of true immortality. The chairman receives ludicrous amounts of pay daily."},
}