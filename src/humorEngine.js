const categories = {
  adjectives_grand: [
    'absolute', 'almighty', 'ancient', 'angelic', 'audacious', 'brilliant',
    'celestial', 'colossal', 'epic', 'eternal', 'exalted', 'exquisite',
    'exuberant', 'fabulous', 'ferocious', 'glorious', 'glowing', 'immortal',
    'imperial', 'imposing', 'luminous', 'majestic', 'marvelous', 'monstrous',
    'paramount', 'primal', 'profound', 'resolute', 'royal', 'sacred',
    'splendid', 'steadfast', 'stellar', 'sublime', 'supreme', 'ultimate',
    'undaunted', 'universal', 'unrivaled', 'valiant', 'vigorous', 'virtuous',
    'vivacious',
  ],

  adjectives_silly: [
    'absurd', 'askew', 'awkward', 'babbling', 'baffling', 'bloated', 'bogus',
    'bouncy', 'bubbly', 'chubby', 'clumsy', 'clunky', 'comfy', 'corny',
    'cuddly', 'dainty', 'dastardly', 'dingy', 'ditzy', 'dizzy', 'dodgy',
    'drippy', 'finicky', 'flaky', 'frantic', 'gangly', 'giddy', 'giggly',
    'gloomy', 'gooey', 'goofy', 'gummy', 'hefty', 'icky', 'jittery', 'jolly',
    'jumbo', 'kooky', 'lanky', 'mangy', 'mushy', 'nifty', 'nutty',
    'obnoxious', 'perky', 'pesky', 'pointy', 'portly', 'prissy', 'rickety',
    'runny', 'saggy', 'sappy', 'scrawny', 'scruffy', 'shabby', 'shaky',
    'slinky', 'sloppy', 'spooky', 'squishy', 'stinky', 'stuffy', 'tacky',
    'tubby', 'unkempt', 'unruly', 'whimsical', 'wobbly', 'woozy',
  ],

  animals: [
    'albatross', 'anaconda', 'anteater', 'antelope', 'armadillo', 'baboon',
    'badger', 'barracuda', 'bobcat', 'buffalo', 'bullfrog', 'bunny', 'canary',
    'catfish', 'chihuahua', 'chimp', 'colt', 'crawfish', 'critter', 'dingo',
    'dolphin', 'dragonfly', 'duckling', 'eagle', 'earthworm', 'eel',
    'elephant', 'elk', 'emu', 'falcon', 'ferret', 'finch', 'flounder', 'fox',
    'gander', 'gecko', 'gerbil', 'gnat', 'goldfish', 'gopher', 'greyhound',
    'hamster', 'hedgehog', 'herring', 'iguana', 'jackal', 'kangaroo', 'kitten',
    'koala', 'ladybug', 'lion', 'lizard', 'llama', 'macaw', 'manatee',
    'mantis', 'marlin', 'mollusk', 'mongoose', 'moose', 'mule', 'mutt',
    'ocelot', 'octopus', 'opossum', 'otter', 'owl', 'oyster', 'panda',
    'panther', 'parakeet', 'parrot', 'partridge', 'pelican', 'pigeon',
    'platypus', 'pony', 'poodle', 'porcupine', 'possum', 'pug', 'puma',
    'python', 'quail', 'raven', 'scorpion', 'shrimp', 'slug', 'squid',
    'stallion', 'starfish', 'stingray', 'swan', 'tadpole', 'tarantula',
    'tiger', 'trout', 'turtle', 'walrus', 'wasp', 'weasel', 'wolf',
    'wolverine', 'yak', 'zebra',
  ],

  foods: [
    'anchovy', 'apple', 'apricot', 'artichoke', 'asparagus', 'bacon', 'bagel',
    'baguette', 'banana', 'biscuit', 'broccoli', 'burrito', 'cabbage', 'cake',
    'calamari', 'calzone', 'caramel', 'carrot', 'caviar', 'celery', 'cheddar',
    'cheese', 'chili', 'cobbler', 'coconut', 'coleslaw', 'cornbread',
    'crouton', 'crumpet', 'cucumber', 'cupcake', 'curry', 'custard', 'donut',
    'dumpling', 'eggnog', 'eggplant', 'enchilada', 'escargot', 'espresso',
    'fondue', 'garlic', 'gherkin', 'granola', 'grape', 'gravy', 'guacamole',
    'hazelnut', 'hummus', 'jalapeno', 'jelly', 'kebab', 'kiwi', 'lemon',
    'lettuce', 'licorice', 'linguini', 'macaroni', 'mango', 'marmalade',
    'muffin', 'mushroom', 'mustard', 'nacho', 'noodle', 'nutmeg', 'olive',
    'onion', 'pancake', 'papaya', 'parsnip', 'pasta', 'pastrami', 'pecan',
    'popcorn', 'porridge', 'pretzel', 'prune', 'raisin', 'ravioli', 'risotto',
    'salami', 'salsa', 'sardine', 'scone', 'spaghetti', 'stew', 'sushi',
    'syrup', 'taco', 'tamale', 'tapioca', 'tofu', 'truffle', 'turnip',
    'vanilla', 'waffle', 'walnut', 'wasabi', 'yogurt',
  ],

  body_parts: [
    'abdomen', 'ankle', 'appendix', 'armpit', 'clavicle', 'cranium',
    'diaphragm', 'eardrum', 'earlobe', 'elbow', 'esophagus', 'femur',
    'follicle', 'groin', 'hamstring', 'hangnail', 'jawline', 'kneecap',
    'ligament', 'liver', 'lung', 'marrow', 'molar', 'nostril', 'pancreas',
    'pelvis', 'ribcage', 'skeleton', 'spleen', 'sternum', 'thigh', 'thumb',
    'tibia', 'toenail', 'udder', 'vertebrae', 'wrist',
  ],

  actions_dramatic: [
    'ambush', 'annex', 'astonish', 'astound', 'avenge', 'banish', 'bash',
    'battle', 'blast', 'blitz', 'breach', 'captivate', 'catapult', 'clobber',
    'collapse', 'confront', 'decree', 'detonate', 'dismantle', 'eliminate',
    'empower', 'enrage', 'erupt', 'escalate', 'evade', 'exile', 'explode',
    'exploit', 'implode', 'launch', 'mobilize', 'overcome', 'overthrow',
    'plunder', 'prevail', 'pulverize', 'pummel', 'purge', 'ransack', 'ravage',
    'revolt', 'rupture', 'seize', 'stomp', 'strike', 'thrash', 'torpedo',
    'triumph', 'unleash', 'vanquish',
  ],

  actions_mundane: [
    'annotate', 'approve', 'budget', 'catalog', 'clip', 'commute', 'compile',
    'copy', 'delete', 'document', 'filing', 'lather', 'launder', 'monitor',
    'mop', 'plod', 'process', 'proofread', 'pruning', 'rearrange', 'reply',
    'rinse', 'scanning', 'schedule', 'shelving', 'snipping', 'staple',
    'sweep', 'trimming', 'update', 'upload', 'washing', 'wipe',
  ],

  objects_mundane: [
    'broom', 'bucket', 'clipboard', 'coaster', 'commode', 'curtain',
    'detergent', 'doorbell', 'doorknob', 'doormat', 'doorstep', 'doorstop',
    'dumpster', 'faucet', 'galoshes', 'hammock', 'hamper', 'handrail',
    'kettle', 'ladle', 'latch', 'lunchbox', 'mop', 'napkin', 'oven',
    'padlock', 'pencil', 'plywood', 'recliner', 'rug', 'spatula', 'sponge',
    'spool', 'squeegee', 'staple', 'thimble', 'thread', 'tray', 'umbrella',
    'wrench', 'yarn',
  ],

  objects_fancy: [
    'alabaster', 'canopy', 'cathedral', 'chalice', 'chariot', 'citadel',
    'crown', 'crystal', 'dynasty', 'emblem', 'emerald', 'emperor', 'estate',
    'fanfare', 'fedora', 'figurine', 'galleria', 'garnet', 'gladiator',
    'gown', 'ivory', 'kimono', 'mahogany', 'manor', 'mosaic', 'opal',
    'palace', 'parchment', 'pavilion', 'pendant', 'platinum', 'princess',
    'promenade', 'regalia', 'relic', 'robe', 'ruby', 'satin', 'silk',
    'tapestry', 'tiara', 'tycoon', 'velvet', 'violin', 'waltz',
  ],

  nature: [
    'avalanche', 'blizzard', 'canyon', 'cascade', 'crevice', 'delta',
    'deluge', 'eclipse', 'equinox', 'fossil', 'glacier', 'glade', 'granite',
    'grove', 'hurricane', 'lagoon', 'landslide', 'magma', 'monsoon',
    'mountain', 'oasis', 'ocean', 'quicksand', 'ravine', 'riptide',
    'rockslide', 'savanna', 'thicket', 'tidal', 'tremor', 'tropics',
    'undertow', 'valley', 'volcano', 'wildfire',
  ],

  sounds: [
    'babble', 'bubble', 'buzz', 'cackle', 'clatter', 'crinkle', 'croak',
    'doodle', 'drizzle', 'fiddle', 'flop', 'gargle', 'giggle', 'growl',
    'grunt', 'gurgle', 'jingle', 'jumble', 'kazoo', 'mumble', 'nibble',
    'oink', 'plop', 'quack', 'rumble', 'scribble', 'shimmy', 'shriek',
    'sizzle', 'slam', 'slurp', 'snap', 'sneeze', 'snore', 'snort',
    'splatter', 'squeak', 'squirt', 'stumble', 'swoosh', 'thud', 'trickle',
    'tumble', 'ukulele', 'waggle', 'wobble', 'wriggle', 'yelp', 'yodel',
  ],
};

const templates = [
  // 2-word: grand meets lowly
  ['adjectives_grand', 'animals'],
  ['adjectives_grand', 'objects_mundane'],
  ['adjectives_grand', 'foods'],
  ['adjectives_grand', 'body_parts'],
  ['adjectives_grand', 'sounds'],
  // 2-word: silly meets fancy
  ['adjectives_silly', 'objects_fancy'],
  ['adjectives_silly', 'animals'],
  ['adjectives_silly', 'nature'],
  // 2-word: dramatic meets trivial
  ['actions_dramatic', 'foods'],
  ['actions_dramatic', 'objects_mundane'],
  ['actions_dramatic', 'animals'],
  // 2-word: mundane meets fancy
  ['actions_mundane', 'objects_fancy'],
  ['actions_mundane', 'animals'],
  // 3-word combos
  ['adjectives_grand', 'adjectives_silly', 'animals'],
  ['adjectives_grand', 'animals', 'actions_mundane'],
  ['adjectives_silly', 'objects_fancy', 'sounds'],
  ['adjectives_grand', 'foods', 'actions_dramatic'],
  ['adjectives_silly', 'animals', 'actions_dramatic'],
  ['actions_dramatic', 'adjectives_grand', 'objects_mundane'],
  ['adjectives_grand', 'nature', 'sounds'],
  ['adjectives_silly', 'body_parts', 'sounds'],
  ['actions_mundane', 'adjectives_grand', 'animals'],
  ['animals', 'actions_dramatic', 'foods'],
  ['foods', 'actions_dramatic', 'objects_fancy'],
  // 4-word combos
  ['adjectives_grand', 'adjectives_silly', 'animals', 'actions_mundane'],
  ['adjectives_silly', 'animals', 'actions_dramatic', 'foods'],
  ['actions_mundane', 'adjectives_grand', 'objects_fancy', 'sounds'],
  ['adjectives_grand', 'nature', 'adjectives_silly', 'animals'],
];

const secureRandomInt = (max) => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  let value = array[0];
  while (value >= limit) {
    window.crypto.getRandomValues(array);
    value = array[0];
  }
  return value % max;
};

const pickRandom = (arr) => arr[secureRandomInt(arr.length)];

const generateFromTemplate = (template) =>
  template.map((cat) => pickRandom(categories[cat]));

export const generateFunnyPassphrase = (minLength, maxLength, maxAttempts = 200) => {
  let bestResult = null;
  let bestDistance = Infinity;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const template = pickRandom(templates);
    const words = generateFromTemplate(template);
    const password = words.join(' ');
    const len = password.length;

    if (len >= minLength && len <= maxLength) {
      return { words, password, success: true };
    }

    const distance = len < minLength ? minLength - len : len - maxLength;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestResult = { words, password, success: false };
    }
  }

  return bestResult || { words: [], password: '', success: false };
};
