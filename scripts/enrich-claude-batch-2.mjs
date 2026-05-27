// One-shot enrichment batch 2: 20 words using Claude-generated data.
// Run: node --env-file=.env scripts/enrich-claude-batch-2.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const enrichments = [
  {
    id: "6fffe833-7007-427d-8057-455b5b1ad0a9", // cunt - English
    example_sentences: [
      { original: "Don't be such a cunt about it, just let him borrow the car.", translation: "Don't be such a cunt about it, just let him borrow the car." },
      { original: "Oi, you alright, ya old cunt?", translation: "Hey, how are you, you old bastard? (Australian affectionate)" },
      { original: "That was a proper cunt move, stealing his parking spot.", translation: "That was a real asshole move, stealing his parking spot." },
      { original: "He called her the c-word at work and got fired on the spot.", translation: "He called her the c-word at work and got fired on the spot." },
      { original: "Cunt! I just stepped on a Lego!", translation: "Fuck! I just stepped on a Lego!" }
    ],
    cultural_context: "Cunt is the most divisive word in the English language — its severity changes more between dialects than any other swear word. In American English, it sits alone at the absolute top of the profanity hierarchy. A 2020 Ofcom survey in the UK confirmed it as the single most offensive word in the language. Americans use it so rarely that hearing it in conversation produces genuine shock. It's one of the few English words that can still make a room go silent. The gender politics are inseparable from the word: using it against a woman is widely considered the most misogynistic thing you can say in English, and many American women report a visceral physical reaction to hearing it.\n\nThe transatlantic divide is enormous. In Australia, \"cunt\" has been substantially defanged through constant casual use. \"Sick cunt\" is a genuine compliment meaning someone impressive or generous. \"Good cunt\" means a reliable friend. \"Mad cunt\" means someone entertainingly reckless. Australian workplace culture still considers it inappropriate for formal settings, but a tradie calling a mate a \"funny cunt\" at a barbecue is completely unremarkable. British English sits in the middle — the word is clearly vulgar and carries real weight, but British men use it among friends more freely than Americans would. Scottish English goes even further: in Glasgow, \"ya cunt\" can mean \"you person\" with almost no offensive intent.\n\nThe word appears in Chaucer's Canterbury Tales (c. 1390) as \"queynte\" — a direct ancestor — used without particular shame in a comic sexual context. The street name \"Gropecunt Lane\" existed in multiple English cities during the medieval period, marking red-light districts. The word's journey from anatomical descriptor to ultimate taboo tracks the entire history of English-language sexual politics. In 2007, the TV show \"Curb Your Enthusiasm\" built an entire episode around the word's taboo power. In 2017, Samantha Bee called Ivanka Trump a \"feckless cunt\" on her TBS show, triggering a national controversy and sponsor withdrawals — demonstrating that in American media, this single word still carries more explosive power than virtually any other combination of syllables.",
    regional_variations: [
      { region: "United States", severity: 5, note: "The single most taboo word in American English. Considered deeply misogynistic. Using it in any context, even quoting, causes visible discomfort." },
      { region: "Australia", severity: 2, note: "Substantially defanged. 'Sick cunt' = awesome person, 'good cunt' = reliable friend. Still inappropriate in formal settings but casual among mates." },
      { region: "UK", severity: 4, note: "Very offensive but used among male friends more freely than in the US. The word appears on post-watershed British TV occasionally." },
      { region: "Scotland", severity: 3, note: "'Ya cunt' can be nearly neutral, meaning 'you person.' Glasgow slang uses it with minimal sting in casual speech." }
    ]
  },
  {
    id: "b533ee16-81d9-4059-a3fb-9ca65ae554b4", // クソ野郎 (kusoyarou) - Japanese
    example_sentences: [
      { original: "あのクソ野郎、また約束破りやがった。", translation: "That shithead broke his promise again." },
      { original: "クソ野郎！前見て運転しろ！", translation: "You asshole! Watch where you're driving!" },
      { original: "映画のクソ野郎キャラが一番面白かった。", translation: "The asshole character in the movie was the funniest." },
      { original: "お前がクソ野郎だってことは、みんな知ってるよ。", translation: "Everyone knows you're a shithead." },
      { original: "クソ野郎…信じてたのに。", translation: "That bastard... I trusted him." }
    ],
    cultural_context: "Kusoyarou is Japanese profanity's compound masterpiece — it takes two already-strong words and fuses them into something more offensive than either part alone. \"Kuso\" (shit) is the most versatile Japanese swear word, functioning as exclamation, prefix, and adjective. \"Yarou\" (bastard/fellow) is a rough masculine insult on its own. Together, they produce a word that hits roughly as hard as English \"motherfucker\" or \"total piece of shit\" — reserved for moments of genuine rage or contempt. You won't hear it in casual banter between friends the way you might hear \"baka\" or even \"kuso\" alone. When someone reaches for kusoyarou, they mean it.\n\nThe word is overwhelmingly male — both in who says it and who it's directed at. Japanese profanity in general is heavily gendered, and kusoyarou specifically uses the masculine suffix -yarou, which etymologically refers to men. A woman using kusoyarou would sound doubly transgressive: both for the vulgarity itself and for adopting a masculine speech register. In anime and manga, kusoyarou is typically reserved for antagonist characters or for protagonists in their most intense moments of fury. Shōnen (boys') manga characters might say it when confronting a villain who has genuinely crossed a moral line, signaling to the audience that this is serious.\n\nThe word had a viral moment in international pop culture when a clip from the anime \"Attack on Titan\" featuring the protagonist screaming \"kusoyarou\" at his enemies circulated on social media platforms around 2019-2020. Non-Japanese anime fans adopted it as a meme, often using it playfully in gaming contexts — a usage that would strike native Japanese speakers as oddly casual for such a heavy word. This mirrors the broader pattern of Japanese profanity being \"exported\" through anime at a lower severity level than it carries domestically: international fans use kusoyarou the way they might say \"you bastard\" in English, not realizing it lands closer to \"you absolute piece of shit\" in its native context.",
    regional_variations: []
  },
  {
    id: "1bfe7aa0-f746-455b-80f4-3ab1698130a1", // 野郎 (yarou) - Japanese
    example_sentences: [
      { original: "このやろう！ふざけんな！", translation: "You bastard! Don't mess with me!" },
      { original: "あの野郎、また遅刻しやがった。", translation: "That jerk is late again." },
      { original: "やろう、やるじゃねえか。", translation: "You bastard, not bad at all. (grudging respect)" },
      { original: "コノヤロー！バカヤロー！", translation: "You bastard! You idiot! (classic combo)" },
      { original: "あいつはいい野郎だよ、口は悪いけど。", translation: "He's a good guy, even if he talks rough." }
    ],
    cultural_context: "Yarou is the building block of Japanese masculine insults — rarely used alone but essential as a suffix that transforms other words into personal attacks. \"Bakayarou\" (stupid bastard), \"kusoyarou\" (shitty bastard), and \"kono yarou\" (this bastard) are among the most recognizable Japanese insults worldwide, and all depend on yarou to convert a descriptive word into a direct confrontation. The word originally just meant \"fellow\" or \"man\" with no negative connotation, but centuries of use in aggressive contexts have permanently stained it. Today, calling someone \"yarou\" by itself implies they're a low-class, rough character — not someone deserving of respect.\n\nThe gendered dimension is absolute. Yarou contains the kanji 郎, which specifically denotes a male person (it's the same character used in traditional boys' names like Taro, Ichiro, Jiro). There is no female equivalent — Japanese doesn't have a word like \"yarou\" for women because the entire register of rough, aggressive masculine speech operates differently from women's speech patterns. When a female character in anime or film uses yarou-class language, it's a deliberate character choice signaling that she's tough, tomboyish, or has rejected conventional femininity. This gendering isn't just cultural; it's baked into the word's grammar.\n\n\"Bakayarou\" (馬鹿野郎) gained international fame through Japanese cinema, particularly Akira Kurosawa's films where samurai characters would spit it at opponents. But its most unexpected cultural moment came in 1953, when Prime Minister Yoshida Shigeru dissolved the Japanese Diet (parliament) after calling an opposition member \"bakayarou\" during a heated exchange. The incident became known as the \"Bakayarou Dissolution\" (バカヤロー解散) — an official political crisis triggered by a single swear word. It remains one of the most famous moments in Japanese parliamentary history and is taught in schools as an example of how words have consequences, even at the highest levels of government.",
    regional_variations: [
      { region: "Kanto (Tokyo)", severity: 3, note: "Standard usage. 'Kono yarou' is the go-to angry confrontation phrase for men." },
      { region: "Kansai (Osaka)", severity: 3, note: "Used but competes with Kansai-specific insults. Osaka speakers might prefer 'aho' or 'donkusai' for the same situations." }
    ]
  },
  {
    id: "5cde9f1e-1056-4f93-95ac-74223ce8e289", // Faen - Norwegian
    example_sentences: [
      { original: "Faen, jeg glemte nøklene igjen!", translation: "Fuck, I forgot my keys again!" },
      { original: "Hva faen driver du med?", translation: "What the fuck are you doing?" },
      { original: "Det var faen meg det beste jeg har smakt.", translation: "That was fucking the best thing I've ever tasted." },
      { original: "For faen, det ble bra!", translation: "Damn, that turned out great!" },
      { original: "Faen ta deg, din jævel!", translation: "Damn you, you bastard!" }
    ],
    cultural_context: "Faen is Norway's linguistic Swiss Army knife — a word so deeply embedded in daily speech that removing it from Norwegian would leave visible holes in the language. It derives from \"fanden,\" an old Norse term for the Devil, making it part of the Scandinavian tradition of religious profanity (alongside Swedish \"fan\" and Danish \"fanden\"). But modern Norwegians don't think about Satan when they say it. Faen has been completely secularized into pure emotional punctuation. A construction worker in Tromsø dropping a hammer says \"faen.\" A teenager in Oslo whose team just scored says \"faen.\" A grandmother who burns a waffle says \"faen.\" The word crosses every demographic line in Norwegian society.\n\nFaen's versatility comes from its ability to combine with other words and phrases. \"Faen ta deg\" (damn you) is a direct curse. \"Hva faen\" (what the fuck) expresses disbelief. \"Faen meg\" (fuck me / I swear) is an intensifier meaning \"I'm dead serious.\" \"For faen\" works as both frustration and admiration depending on tone. \"Jævla\" (devilish/damned, from the same religious root) serves as the adjective form. The entire system of Norwegian emotional expression is built on this one word and its derivatives, which is remarkable for a country often stereotyped as reserved and underexpressive.\n\nThe word's cultural status was cemented by Norwegian television and comedy. The sketch show \"Team Antonsen\" and comedian Bård Tufte Johansen have both used faen as a comedic device, playing on the contrast between Norway's polite public culture and the word's omnipresence in private speech. In 2005, the Norwegian Broadcasting Corporation (NRK) conducted an informal survey finding that faen was the most commonly used Norwegian swear word by a wide margin. The word also appears in the distinctly Norwegian tradition of \"banning\" (swearing) at the weather — Norwegians standing at bus stops muttering \"faen, det er kaldt\" (fuck, it's cold) is practically a national pastime from October to April.",
    regional_variations: [
      { region: "Eastern Norway (Oslo)", severity: 3, note: "Standard pronunciation and usage. Fully integrated into casual speech." },
      { region: "Northern Norway", severity: 2, note: "Swearing in general is more casual and frequent in northern dialects. Faen carries less shock value." },
      { region: "Western Norway (Bergen)", severity: 3, note: "Same severity. Bergen dialect adds its own local swears but faen is universal." }
    ]
  },
  {
    id: "a987c0fc-8da1-4ed9-8dcc-15980fcfcc8a", // vaffanculo - Italian
    example_sentences: [
      { original: "Vaffanculo, non me ne frega niente!", translation: "Fuck off, I don't give a damn!" },
      { original: "Gli ho detto vaffanculo e me ne sono andato.", translation: "I told him to fuck off and I left." },
      { original: "Ma vaffanculo, dai! Non ci credo!", translation: "Oh fuck off, come on! I don't believe it!" },
      { original: "Vaffanculo a te e a chi ti ha mandato.", translation: "Fuck you and whoever sent you." },
      { original: "Vaffanculo! Mi hai fatto prendere un colpo!", translation: "Fuck! You scared the shit out of me!" }
    ],
    cultural_context: "Vaffanculo is Italian profanity's nuclear option — a contraction of \"va' a fare in culo\" (go do it in the ass) that has become the single most recognized Italian swear word worldwide. Its power comes from the combination of a dismissive command (go) with an aggressive sexual act (anal penetration), producing a phrase that simultaneously tells someone to leave and to degrade themselves. In Italian social dynamics, vaffanculo is the line you cross when you've given up on a conversation. Everything before it — cazzo, stronzo, che palle — is escalation. Vaffanculo is termination. When an Italian person says it to your face, the relationship (romantic, professional, familial) has reached its breaking point.\n\nThe word is almost always accompanied by hand gestures — Italian communication is inseparable from its gestural language. The most common pairing is the forearm jerk (\"il gesto dell'ombrello\"): slapping one hand into the crook of the opposite arm while raising the fist. This gesture can substitute for the word entirely — an Italian driver in traffic might perform the gesture silently through the windshield, and every other driver understands exactly what's being communicated. The chin flick (brushing the back of the fingers under the chin outward) also accompanies vaffanculo, meaning roughly \"I couldn't care less about you.\"\n\nThe word achieved its most spectacular political moment in 2007 when comedian Beppe Grillo launched the \"Vaffanculo Day\" (V-Day) rallies, using the word as the name of a political protest movement against corrupt Italian politicians. The rallies drew hundreds of thousands of people across Italian cities and directly led to the founding of the Five Star Movement (Movimento 5 Stelle), which went on to become Italy's largest political party and form a government in 2018. An entire governing coalition, one that produced a Prime Minister, traces its origin to a public event named after a swear word. No other profanity in any language can claim to have literally reshaped the political landscape of a G7 nation.",
    regional_variations: [
      { region: "Rome/Central Italy", severity: 5, note: "The Romanesco variant 'vattela a pijà 'n der culo' is even longer and more elaborate. Romans are known for creative profanity." },
      { region: "Northern Italy (Milan, Turin)", severity: 5, note: "Same word, same severity. Northern Italians may use it less frequently in daily speech compared to Romans but it hits just as hard." },
      { region: "Southern Italy (Naples, Sicily)", severity: 4, note: "Still very offensive but southern Italian dialects have their own rich profanity traditions. Neapolitan has local equivalents that compete with the standard Italian form." }
    ]
  },
  {
    id: "f3d635fb-62a1-4454-b548-6010ddb1aad1", // どけ (doke) - Japanese
    example_sentences: [
      { original: "どけ！邪魔なんだよ！", translation: "Move! You're in the way!" },
      { original: "おい、どけよ。通れないだろ。", translation: "Hey, move it. I can't get through." },
      { original: "どけどけ！救急車が来るぞ！", translation: "Out of the way! An ambulance is coming!" },
      { original: "どけ、このやろう！", translation: "Get out of my way, you bastard!" },
      { original: "どけって言ってんだろ！聞こえないのか！", translation: "I said move! Can't you hear me?!" }
    ],
    cultural_context: "Doke is the bare imperative form of \"doku\" (to step aside), and in Japanese — a language where politeness levels are grammatically encoded — using the bare imperative to a stranger is itself an act of aggression. The polite request would be \"sumimasen, doke te itadakemasen ka\" (excuse me, could you please move aside). The casual version would be \"chotto doke te\" (move a bit, please). Stripping away all politeness markers to arrive at just \"doke\" is a deliberate choice to treat the other person as beneath basic courtesy. It's the linguistic equivalent of shoving someone — the words do what a push would do.\n\nIn Japanese social context, personal space violations and public confrontations are so uncommon that \"doke\" carries amplified shock value. Japan's crowded trains are famously silent and orderly; people tolerate extreme physical closeness without verbal complaint. Someone shouting \"doke\" on a train platform would turn every head within earshot. The word is almost exclusively used by men — women using the bare imperative form would be performing a kind of linguistic masculinity that marks them as either genuinely threatening or deliberately provocative. In anime and manga, \"doke\" is the word a powerful character says to subordinates or obstacles, conveying absolute authority and zero patience.\n\nThe word appears constantly in action anime and samurai films, where it functions as the verbal warning before violence. A character who says \"doke\" and is ignored will typically follow up with a physical attack — the word serves as a last chance before escalation. This media association has given \"doke\" a cinematic quality that actual Japanese speakers are aware of: saying \"doke\" in real life consciously or unconsciously invokes the trope of the dangerous warrior clearing a path. Younger Japanese men sometimes use it semi-ironically among close friends, borrowing the anime tough-guy register for comic effect, but this playfulness depends entirely on everyone understanding it as performance.",
    regional_variations: []
  },
  {
    id: "9d64284f-e46b-4f28-8b6d-3fd596c779ac", // चमार (chamar) - Hindi
    example_sentences: [
      { original: "उसने गुस्से में 'चमार' बोल दिया और FIR हो गई।", translation: "He said 'chamar' in anger and an FIR (police report) was filed." },
      { original: "ये शब्द बोलना कानूनी अपराध है, समझे?", translation: "Saying this word is a criminal offense, understand?" },
      { original: "स्कूल में एक बच्चे को 'चमार' बोला, टीचर ने सस्पेंड कर दिया।", translation: "A kid called someone 'chamar' at school, the teacher suspended them." },
      { original: "चमार बोलकर किसी की इज्ज़त नहीं उतारते।", translation: "You don't strip someone's dignity by calling them 'chamar.'" },
      { original: "ये जातिवादी गाली है, इसके लिए जेल हो सकती है।", translation: "This is a casteist slur, you can go to jail for it." }
    ],
    cultural_context: "Chamar is not ordinary profanity — it's a caste designation weaponized as a slur, and understanding its severity requires understanding India's caste system. The Chamars are a Dalit (formerly \"untouchable\") community historically associated with leatherworking, which is considered ritually polluting in Hindu caste ideology. When someone uses \"chamar\" as an insult, they're invoking the entire apparatus of caste hierarchy: the implication is that the target is inherently impure, lowborn, and subhuman. This makes it fundamentally different from other profanity — calling someone \"chamar\" isn't just rude, it's an act of social violence that reinforces a system of oppression affecting 200+ million Dalits in India.\n\nThe word is explicitly criminalized. The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 (amended 2015) makes using caste-based slurs a non-bailable offense carrying up to 5 years imprisonment. Police regularly file FIRs (First Information Reports) for its use, and Indian courts have upheld convictions. Despite this legal framework, the word persists in practice — particularly in rural North India, where caste hierarchies remain entrenched in daily life. Upper-caste individuals sometimes use it behind closed doors or during confrontations when they believe there are no witnesses. The gap between legal prohibition and social reality is one of India's most painful ongoing struggles.\n\nDalit rights movements have reclaimed the word in political contexts. The Bahujan Samaj Party (BSP), which has governed Uttar Pradesh (India's most populous state), has used Dalit identity including caste names as sources of political pride rather than shame. Dalit literature — a genre that has produced internationally recognized authors like Omprakash Valmiki (whose autobiography \"Joothan\" describes the violence attached to the word) — has forced mainstream Indian culture to confront the reality behind the slur. In 2018, nationwide protests erupted after a Supreme Court ruling was perceived as weakening the Atrocities Act, demonstrating how deeply the legal protection against caste slurs matters to hundreds of millions of Indians. The word \"chamar\" thus exists at the intersection of language, law, identity, and some of humanity's oldest systems of inequality.",
    regional_variations: [
      { region: "North India (UP, Bihar, Rajasthan)", severity: 5, note: "Highest frequency and maximum offense. Caste hierarchies are most rigid here. Legally actionable." },
      { region: "South India", severity: 5, note: "Equally offensive when used but less common — South Indian languages have their own caste-based slurs." },
      { region: "Urban India (Delhi, Mumbai)", severity: 5, note: "Still maximally offensive and illegal. Urban educated Indians may be more aware of legal consequences." }
    ]
  },
  {
    id: "0e2d63c9-cd31-454d-ba45-f647d5c4b234", // cum-dumpster - English
    example_sentences: [
      { original: "He called her a cum-dumpster online and got permanently banned.", translation: "He called her a cum-dumpster online and got permanently banned." },
      { original: "That word gets you fired faster than anything else in the HR manual.", translation: "That word gets you fired faster than anything else in the HR manual." },
      { original: "Some troll in the comments called the actress a cum-dumpster — the post got removed in minutes.", translation: "Some troll in the comments called the actress a cum-dumpster — the post got removed in minutes." },
      { original: "If you use words like 'cum-dumpster,' you deserve every blocked contact.", translation: "If you use words like 'cum-dumpster,' you deserve every blocked contact." },
      { original: "His defense was 'it's just a word' — the judge disagreed.", translation: "His defense was 'it's just a word' — the judge disagreed." }
    ],
    cultural_context: "Cum-dumpster belongs to a category of English insults that exist purely to inflict maximum psychological damage through dehumanization. The compound combines a bodily fluid with a waste container, reducing a person to an object whose only function is receiving and disposing of something others discard. Unlike older vulgarities that have accumulated layers of casual use and even affection over centuries, cum-dumpster has no playful register, no softened context, no affectionate usage between friends. It was constructed — likely emerging in the early internet era of the 2000s — specifically to be as degrading as possible.\n\nThe word is overwhelmingly deployed against women and is considered one of the most misogynistic terms in contemporary English. Its severity goes beyond \"slut\" or \"whore\" because those words, while degrading, still acknowledge personhood. Cum-dumpster reduces the target to a non-human object — not even a person who makes choices, but a passive container. This dehumanization element puts it in the same category as the most extreme slurs in the language. Content moderation teams at major platforms (Meta, Reddit, Discord) flag it for immediate removal, and HR departments list it among terms that constitute a hostile workplace environment warranting immediate termination.\n\nThe word gained visibility primarily through internet culture — anonymous forums, gaming voice chat, and toxic online communities. It exemplifies how digital anonymity enables language that would be socially impossible face-to-face. Very few people would say this word aloud in a room with others present, but it appears routinely in online harassment campaigns. Anti-harassment researchers studying platforms like Twitter and Twitch have documented it as one of the most common extreme insults directed at women content creators. In several documented cyberbullying cases that reached court proceedings, the use of this specific term was cited as evidence of intent to cause severe emotional distress.",
    regional_variations: []
  },
  {
    id: "410e15ae-e8f9-4f65-94c7-3af73aed619a", // चूत (choot/chut) - Hindi
    example_sentences: [
      { original: "चूत मत बोल यार, बहुत गंदा शब्द है।", translation: "Don't say chut, man, it's a really filthy word." },
      { original: "उसने गुस्से में चूतिया बोल दिया, फिर पिटाई हो गई।", translation: "He called him chutiya in anger, then got beaten up." },
      { original: "चूतमारीके, तू फिर आ गया?", translation: "You motherfucker, you're back again?" },
      { original: "ये चूतियापा बंद करो, काम करो।", translation: "Stop this bullshit, do some work." },
      { original: "चूत! बिजली फिर गई!", translation: "Fuck! The power went out again!" }
    ],
    cultural_context: "Chut is the anatomical root of Hindi's most productive swear word family. On its own, it's the most vulgar possible word for female genitalia — so taboo that even in raunchy Bollywood films it's never spoken clearly. But the word's real power lies in the derivatives it spawns. \"Chutiya\" (literally \"born of a vagina,\" functionally \"complete idiot\") is arguably the most commonly used Hindi insult. \"Chutiyapa\" (chutiya-ness) means absurd nonsense or bullshit. \"Chutmarike\" (one whose mother's vagina was involved) is a compound insult. This derivative system means most Hindi speakers use words built from chut daily without necessarily thinking about the anatomical root — the way English speakers use \"fucking\" as an intensifier without conjuring sexual imagery.\n\nThe taboo around the base word chut is stronger than around its derivatives, creating an unusual situation where the children are more socially acceptable than the parent. A college student saying \"chutiyapa\" (nonsense) in class might get a sharp look from a professor; the same student saying \"chut\" would be sent to the dean. This severity gradient mirrors how the word functions: as a standalone, it's raw anatomy. As a suffix or root, it's been grammaticalized into something less literal. Hindi speakers navigate this gradient instinctively, choosing their derivation based on how much they want to shock.\n\nThe word is shared across Hindi, Urdu, Punjabi, and other North Indian languages with minimal variation — a linguistic unity that crosses the India-Pakistan border. Pakistani Punjabi speakers use \"chut\" with essentially identical meaning and severity as Hindi speakers in Delhi. This shared profanity vocabulary is one of the quiet linguistic bonds between India and Pakistan that persists despite political tension. The word has ancient Indo-Aryan roots and cognates appear in other South Asian languages, suggesting it's been part of the subcontinent's vulgar vocabulary for well over a thousand years. Unlike borrowed profanity (like English \"fuck\" which has entered urban Hindi), chut is deeply indigenous.",
    regional_variations: [
      { region: "North India (Hindi belt)", severity: 5, note: "Maximum offense as standalone. Derivatives like 'chutiya' drop to severity 3-4 through frequency of use." },
      { region: "Punjab (India & Pakistan)", severity: 5, note: "Same word, same weight. Crosses the India-Pakistan linguistic boundary unchanged." },
      { region: "Mumbai/Maharashtra", severity: 5, note: "Used in Hindi/Urdu conversations. Marathi has its own equivalents but chut is understood by all." }
    ]
  },
  {
    id: "396580c3-870e-4187-bbd0-4f0f18b0d090", // रंडी (randi) - Hindi
    example_sentences: [
      { original: "रंडी का बच्चा, भाग यहाँ से!", translation: "Son of a whore, get out of here!" },
      { original: "उसे रंडी बोला तो थप्पड़ पड़ गया।", translation: "He called her randi and got slapped." },
      { original: "ये रंडीबाज़ लोग सब बेईमान हैं।", translation: "These whoremongers are all dishonest." },
      { original: "रंडी रोना बंद कर, कुछ काम कर।", translation: "Stop whining (randi-crying), do something useful." },
      { original: "रंडी! गाड़ी सीधी चला!", translation: "Bitch! Drive straight!" }
    ],
    cultural_context: "Randi is Hindi's most direct word for a prostitute, and using it as an insult carries the full weight of South Asian sexual honor culture. In a society where a family's \"izzat\" (honor/reputation) is closely tied to female sexual behavior, calling a woman a randi doesn't just insult her — it attacks her entire family's social standing. The accusation of sexual looseness, even as a throwaway insult, can have real social consequences in conservative communities: damaged marriage prospects, family ostracism, and in extreme cases, violence framed as \"honor\" defense. This social architecture makes randi substantially more dangerous than its English equivalent \"whore.\"\n\nThe compound forms extend the word's reach. \"Randi ka bachcha\" (son of a whore) is the Hindi equivalent of \"son of a bitch\" but hits harder because of the honor-culture context. \"Randibaz\" means a man who frequents prostitutes — a womanizer. \"Randi rona\" (literally \"whore-crying\") has evolved into slang meaning to whine or complain excessively, detached enough from its origin that young people sometimes use it without realizing the etymology. This semantic drift is happening in real time: urban Hindi speakers under 30 might say \"randi rona\" as casually as \"bitching,\" while their parents would be shocked by the same phrase.\n\nBollywood has a complicated relationship with randi. Mainstream Hindi cinema rarely uses the word directly — the Central Board of Film Certification (India's censor board) treats it as among the most censorable terms. But the word appears in \"realistic\" cinema and OTT platform content (Mirzapur, Sacred Games, Gangs of Wasseypur), where its inclusion signals gritty authenticity. Gangs of Wasseypur (2012) — widely considered one of the greatest Indian films — features characters who use randi as part of a broader profanity-rich dialect that the director Anurag Kashyap insisted was essential to portraying the real speech patterns of Bihar's criminal underworld. The film's success helped normalize the depiction (though not the acceptance) of extreme Hindi profanity in Indian entertainment.",
    regional_variations: [
      { region: "North India (UP, Bihar, MP)", severity: 4, note: "Most commonly used here. Carries severe social consequences when directed at a woman, especially in rural areas." },
      { region: "Urban India (Delhi, Mumbai)", severity: 3, note: "Still offensive but young urban speakers use derivatives like 'randi rona' casually without the full sting." },
      { region: "Pakistan (Urdu speakers)", severity: 4, note: "Same word exists in Urdu with identical meaning and severity. Even more taboo in Pakistan's more conservative social context." }
    ]
  },
  {
    id: "eadb185a-e5f5-4742-b98e-983bc0fc8b28", // jembut - Indonesian
    example_sentences: [
      { original: "Dasar jembut! Nggak bisa apa-apa!", translation: "You useless piece of shit! Can't do anything!" },
      { original: "Muka lu kayak jembut, nggak usah sok ganteng.", translation: "Your face looks like pubes, stop acting handsome." },
      { original: "Jembut! Hampir keinjek paku gara-gara elu!", translation: "Fuck! I almost stepped on a nail because of you!" },
      { original: "Rambut lu kayak jembut, cukur sana.", translation: "Your hair looks like pubes, go get a haircut." },
      { original: "Jangan jadi orang jembut, bisa nggak?", translation: "Don't be a worthless person, can you manage that?" }
    ],
    cultural_context: "Jembut holds a unique position in Indonesian profanity — it's crude enough to shock but specific enough to be funny, which gives it a dual life as both genuine insult and comedic device. The word literally means pubic hair, and its primary insult function works through comparison: calling someone \"jembut\" or saying they look like jembut implies they're ugly, worthless, or disgusting in the way that pubic hair is considered the least dignified part of the human body. The visual imagery is doing the heavy lifting — it's not abstract vulgarity but a concrete, visceral comparison that makes listeners wince and laugh simultaneously.\n\nIn Jakarta street slang (bahasa gaul), jembut circulates more freely than the heavier profanity like \"ngentot\" or \"memek.\" It occupies a middle tier — clearly vulgar and inappropriate for formal settings, but usable among male friends without the relationship-ending weight of top-tier words. The most common deployment is as a physical comparison: \"muka lu kayak jembut\" (your face looks like pubes), \"rambut kayak jembut\" (hair like pubes), \"otak jembut\" (pubes-brain, meaning stupid). These comparisons are staples of Indonesian male banter, particularly in warung (street food stall) culture where groups of men gather after work.\n\nThe word gained unexpected visibility through Indonesian social media humor. Meme pages on Instagram and Twitter frequently use jembut in visual jokes, and the word appears in the comment sections of Indonesian TikTok with remarkable frequency. Indonesian internet humor tends toward the deliberately crude and absurd, and jembut fits perfectly — it's offensive enough to feel transgressive but not so extreme that it triggers content moderation filters the way \"ngentot\" or \"memek\" would. This sweet spot has made it one of the most searchable Indonesian vulgarities online, with curious non-Indonesian speakers frequently asking for translations in language-learning forums.",
    regional_variations: [
      { region: "Jakarta/Betawi", severity: 4, note: "Home base for this word. Betawi slang uses it most freely and creatively." },
      { region: "Java (non-Jakarta)", severity: 4, note: "Understood across Java. Javanese speakers may have local equivalents but jembut is universally recognized." },
      { region: "Sumatra/Outer Islands", severity: 3, note: "Less commonly used — local languages dominate crude humor — but understood from Jakarta-centric media." }
    ]
  },
  {
    id: "ce51081c-429b-4b15-8b8c-c5d7d90db542", // 새끼 (saekki) - Korean
    example_sentences: [
      { original: "이 새끼 진짜 웃기네 ㅋㅋㅋ", translation: "This dude is hilarious lol" },
      { original: "야 새끼야, 어디 가?", translation: "Hey punk, where are you going?" },
      { original: "그 새끼가 내 돈을 가져갔어.", translation: "That bastard took my money." },
      { original: "우리 강아지 새끼 세 마리 낳았어!", translation: "Our dog had three puppies!" },
      { original: "새끼... 진짜 이러기야?", translation: "You little shit... are you really doing this?" }
    ],
    cultural_context: "Saekki is Korean's great linguistic shape-shifter — a word that means \"baby animal\" in its innocent form and \"punk/bastard\" when aimed at a human. When a Korean farmer says \"강아지 새끼\" (gangaji saekki), they're talking about a puppy, with genuine warmth. When a Korean man says \"이 새끼\" (i saekki, this bastard) to another man, it's an insult. The same word, the same pronunciation, the same characters — only context determines whether it's adorable or aggressive. This duality makes saekki one of the most context-dependent words in Korean, and learning to read that context is a genuine challenge for Korean language students.\n\nAmong young Korean men, saekki has undergone significant softening. In PC방 (PC bangs, internet cafes) and 술집 (bars), friends call each other \"새끼야\" as casually as Americans say \"dude.\" \"이 새끼 진짜\" (this bastard, seriously) between friends who are gaming together is banter, not conflict. But the same word from a stranger, from an older person, or in a formal setting retains its full insulting power. Age dynamics matter enormously: a 30-year-old calling a 20-year-old \"새끼\" might be patronizing but tolerable. The reverse — a younger person calling an older person \"새끼\" — would be a serious breach of Korean social hierarchy that could escalate to physical confrontation.\n\nSaekki's real power emerges in compounds. \"개새끼\" (gaesaekki, dog's offspring — son of a bitch) is one of Korean's most iconic insults. \"쥐새끼\" (jwisaekki, rat's offspring) implies someone is sneaky and untrustworthy. \"미친 새끼\" (michin saekki, crazy bastard) combines it with \"crazy.\" The compound system lets Korean speakers calibrate their insults precisely — choosing which animal prefix to attach telegraphs exactly what kind of contempt they feel. This modularity is part of why Korean swearing feels so expressive: the language gives speakers a construction kit rather than a fixed menu of insults.",
    regional_variations: [
      { region: "Seoul/Standard", severity: 2, note: "Mild-to-moderate among peers. Very common in casual male speech, especially gaming culture." },
      { region: "Gyeongsang (Busan)", severity: 2, note: "Southeastern dialect is rougher in general. Saekki flows more freely here without added weight." },
      { region: "Jeolla (Gwangju)", severity: 2, note: "Same usage. Regional dialect differences affect pronunciation but not severity." }
    ]
  },
  {
    id: "6005cf10-1902-4dc1-a93b-ba29b7216842", // bobo - Filipino
    example_sentences: [
      { original: "Bobo mo naman, ang dali lang nyan!", translation: "You're so stupid, that's so easy!" },
      { original: "Isa kang bobo kung naniniwala ka sa kanya.", translation: "You're an idiot if you believe him." },
      { original: "Huwag kang mag-bobo-bobohan sa harap ko.", translation: "Don't play dumb in front of me." },
      { original: "Bobo gaming yan, kalma ka lang.", translation: "That's noob gaming, just chill." },
      { original: "Ang bobo ko talaga, naiwan ko yung ID.", translation: "I'm so stupid, I left my ID behind." }
    ],
    cultural_context: "Bobo is the Philippines' most democratic insult — used by everyone, from jeepney drivers to college professors, from toddlers to grandparents. Borrowed from the Spanish \"bobo\" (fool, from Latin \"balbus\" meaning stammering), it has been so thoroughly absorbed into Filipino that most speakers don't think of it as a loanword. Its severity is mild enough that it appears in children's arguments (\"bobo ka!\") and parent-child scolding (\"ang bobo-bobo mo naman\"), but it still stings when delivered with genuine contempt from a stranger. The word occupies the same tier as English \"stupid\" — not profanity by most definitions, but capable of real damage depending on context and delivery.\n\nThe word exploded into international gaming culture through Filipino players on MOBA (Multiplayer Online Battle Arena) games, particularly DOTA 2 and Mobile Legends: Bang Bang. Filipino gamers typing \"bobo\" in all-chat to criticize teammates became so ubiquitous that non-Filipino players in Southeast Asian servers learned the word. \"Bobo gaming\" (playing badly) and \"bobo move\" (stupid decision) became cross-cultural gaming slang. The 2016-2020 Mobile Legends era cemented bobo as one of the most internationally recognized Filipino words after \"putang ina\" — a distinction the Philippines' tourism board probably didn't anticipate.\n\nFilipino has a rich system of modifying bobo for emphasis. \"Ang bobo-bobo\" (so stupid, with reduplication for emphasis) is stronger. \"Mag-bobo-bobohan\" (to pretend to be stupid) is a verb form. \"Pabobo\" (becoming stupider) tracks a decline. \"Bobita/bobito\" adds Spanish diminutive suffixes for mock-affection. This morphological flexibility is part of Tagalog's agglutinative character — the language builds meaning by stacking affixes onto roots, and bobo participates in this system as naturally as any native Tagalog word. The fact that a 16th-century Spanish loanword has been so completely integrated into Tagalog grammar demonstrates how Filipino absorbs foreign vocabulary and makes it fully its own.",
    regional_variations: [
      { region: "Metro Manila", severity: 2, note: "Extremely common, almost casual. Used in everyday speech including by children." },
      { region: "Visayas", severity: 2, note: "Understood from Tagalog media but Bisaya speakers have their own equivalent: 'bugo' or 'tanga.'" },
      { region: "International (gaming)", severity: 1, note: "Used by non-Filipino gamers as lightweight trash talk. Has become a pan-Southeast Asian gaming insult." }
    ]
  },
  {
    id: "45025ad8-754b-4f84-9991-3525510c3db3", // bellend - English
    example_sentences: [
      { original: "Don't be such a bellend, just admit you were wrong.", translation: "Don't be such a dickhead, just admit you were wrong." },
      { original: "Some bellend parked across two spaces again.", translation: "Some idiot parked across two spaces again." },
      { original: "You absolute bellend, you left the oven on.", translation: "You absolute dickhead, you left the oven on." },
      { original: "He's a bellend but he's our bellend, you know?", translation: "He's an idiot but he's our idiot, you know?" },
      { original: "Bellend! You scared the life out of me!", translation: "Dickhead! You scared the life out of me!" }
    ],
    cultural_context: "Bellend is quintessentially British — an insult that Americans, Australians, and most other English speakers barely recognize, but that every person in England, Scotland, and Wales understands instantly. It refers to the glans penis (the bell-shaped end of the penis), making it an anatomical insult in the same family as \"dickhead\" or \"knobhead.\" But bellend has a specificity that gives it more comic punch than its synonyms. Calling someone a dickhead is generic; calling them a bellend conjures a more precise and embarrassing image. This anatomical specificity is part of the British insult tradition that favors creative, image-rich vocabulary over blunt force.\n\nThe word sits comfortably in the middle of the British severity scale. It's rude enough that the BBC would bleep it before the 9 PM watershed, but mild enough that you'd hear it at a football match, in a pub, or between mates at work without anyone being genuinely offended. British workplace culture has a higher tolerance for creative insults than American workplace culture, and bellend falls within the acceptable range for many informal British offices — though saying it to your boss would still be career-limiting. It's used almost exclusively for men, which makes sense given the anatomy involved, and it implies foolishness rather than malice: a bellend is an idiot, not a villain.\n\nThe word became an unlikely international talking point in 2015 when a map of British insult geography went viral, showing which regions favored which insults. Bellend dominated the Midlands and North of England. The map sparked debate about whether bellend or \"knobhead\" was the superior British anatomical insult — a discussion that baffled American observers who had encountered neither word. In 2020, UK Prime Minister Boris Johnson was called a \"bellend\" in the House of Commons during a heated debate, which was technically a violation of parliamentary language rules but was met with more laughter than outrage, perfectly illustrating the word's position as an insult that everyone enjoys hearing even (especially) in inappropriate contexts.",
    regional_variations: [
      { region: "England (Midlands/North)", severity: 3, note: "Home territory. Most commonly used in Manchester, Birmingham, Leeds, and surrounding areas." },
      { region: "Scotland", severity: 3, note: "Used but competes with local favorites like 'bawbag,' 'numpty,' and 'walloper.'" },
      { region: "United States", severity: 1, note: "Most Americans don't know the word. When encountered, it sounds quaint or comedic rather than offensive." }
    ]
  },
  {
    id: "819f3b82-125c-4cdd-a79c-756d23bc61d3", // velet - Turkish
    example_sentences: [
      { original: "Bu velet yine sorun çıkardı.", translation: "This brat caused trouble again." },
      { original: "Velet misin sen? Adam gibi konuş.", translation: "Are you a child? Talk like an adult." },
      { original: "O veletlere söyle, sustursinlar.", translation: "Tell those brats to keep it down." },
      { original: "Velet velet davranma, büyüdün artık.", translation: "Stop acting like a brat, you're grown up now." },
      { original: "Daha dün velettin, şimdi evleniyorsun!", translation: "Just yesterday you were a little kid, now you're getting married!" }
    ],
    cultural_context: "Velet is Turkish's go-to word for dismissing someone as childish, immature, or insignificant — a word that reduces an adult to the status of a misbehaving kid. Borrowed from the Arabic \"walad\" (child/boy), it went through Turkish phonological processing to become \"velet,\" picking up contemptuous overtones that the Arabic original doesn't carry. In Arabic, \"walad\" is a neutral word for child. In Turkish, \"velet\" is never neutral — it always implies annoyance, dismissal, or condescension. This semantic shift during borrowing is a common pattern in Turkish, which adopted many Arabic and Persian words but often added negative connotations.\n\nThe word's primary function is to challenge someone's maturity or competence. A Turkish boss calling an employee \"velet\" in front of colleagues is delivering a devastating professional insult — it says \"you don't belong in adult spaces.\" Among friends, it's lighter but still pointed: \"velet gibi davranma\" (don't act like a brat) is a common rebuke. Turkish online culture uses it extensively in gaming and social media arguments, where calling an opponent \"velet\" implies they're literally a child who shouldn't have internet access. This gaming usage has made it one of the most frequently typed Turkish insults on platforms like Discord and Twitch.\n\nTurkish generational dynamics give velet extra bite. Turkish culture places strong emphasis on age-based respect hierarchies (\"büyüklere saygı\" — respect for elders). Being called a velet doesn't just mean \"immature\" — it means \"you haven't earned the right to speak.\" This connects to the broader Turkish concept of \"adam olmak\" (becoming a real man/person), a social milestone that implies responsibility, composure, and gravity. Calling someone velet is saying they haven't achieved \"adam\" status — they're still in the larval stage of personhood. For Turkish men especially, who face strong social pressure to project maturity and authority, being publicly labeled a velet is a challenge to their fundamental social identity.",
    regional_variations: []
  },
  {
    id: "b2f7e016-8967-4d3b-a423-f438aba15944", // palle - Italian
    example_sentences: [
      { original: "Che palle, ancora traffico!", translation: "What a pain, traffic again!" },
      { original: "Non mi rompere le palle con queste domande.", translation: "Don't bust my balls with these questions." },
      { original: "Che palle questo film, andiamo via.", translation: "This movie is such a drag, let's leave." },
      { original: "Ha le palle per farlo, fidati.", translation: "He's got the balls to do it, trust me." },
      { original: "Palle! Ho dimenticato il portafoglio!", translation: "Balls! I forgot my wallet!" }
    ],
    cultural_context: "Palle (balls/testicles) is one of Italian's most useful mid-range profanities — vulgar enough to feel expressive but mild enough to use in front of your mother-in-law without causing a family crisis. The phrase \"che palle\" (what balls, meaning what a pain/how tedious) is so embedded in Italian daily speech that linguists debate whether it still counts as profanity at all. Italians of all ages and social classes use it multiple times a day: stuck in traffic (\"che palle\"), waiting in a government office (\"che palle\"), hearing bad news (\"che palle\"). It's the Italian equivalent of sighing \"oh, come on\" — more reflex than choice.\n\nThe word's real expressiveness comes from its compound phrases. \"Rompere le palle\" (to break the balls) means to annoy someone — it's the exact equivalent of English \"busting my balls\" and is used just as frequently. \"Avere le palle\" (to have balls) means to have courage, identical to the English metaphor. \"Palle piene\" (full balls) means being fed up. \"Due palle\" (two balls) or \"due palle così\" (balls this big, with hand gesture) expresses extreme boredom. This is the anatomical metaphor that Italian and English share almost perfectly — both languages use testicles to represent courage, annoyance, and tedium through the same logical chain.\n\nWhat makes palle culturally interesting is how it compares to its synonym \"coglioni\" (also balls/testicles). Both words refer to the same anatomy, but coglioni is significantly more vulgar. \"Che palle\" is something a news anchor might mutter off-camera; \"che coglioni\" would get them reprimanded. \"Non rompere le palle\" is a firm request; \"non rompere i coglioni\" is aggressive. This severity split between two synonyms for the same body part illustrates how Italian profanity depends less on what you're referring to and more on which register you choose to refer to it in. The word \"palle\" is the polite-vulgar option — Italian's way of letting you reference testicles without fully committing to crudeness.",
    regional_variations: [
      { region: "Italy (nationwide)", severity: 2, note: "Universally understood and mild. 'Che palle' is borderline mainstream — not truly offensive in any region." },
      { region: "Rome", severity: 2, note: "Romans use it constantly. Competes with 'che due maroni' (what two chestnuts) as a euphemistic variant." },
      { region: "Southern Italy", severity: 2, note: "Same usage. Southern dialects may prefer local equivalents but standard 'palle' works everywhere." }
    ]
  },
  {
    id: "dd11592f-bc9c-4881-a5e3-764b8ce9d18c", // filho da puta - Portuguese
    example_sentences: [
      { original: "Filho da puta! Quase me atropelou!", translation: "Son of a bitch! He almost ran me over!" },
      { original: "Aquele filho da puta me deve dinheiro há dois anos.", translation: "That son of a bitch has owed me money for two years." },
      { original: "Seu filho da puta! Que golaço!", translation: "You son of a bitch! What a goal! (admiration)" },
      { original: "Não acredito, filho da puta, que é verdade.", translation: "I can't believe, son of a bitch, that it's true." },
      { original: "Filho da puta... isso doeu.", translation: "Son of a bitch... that hurt." }
    ],
    cultural_context: "Filho da puta is the grand universal of Portuguese-language profanity — the insult that every Portuguese speaker from Lisbon to Luanda to São Paulo knows, uses, and understands. It translates literally as \"son of the whore,\" attacking the listener by calling their mother a prostitute. This maternal-honor attack pattern is shared across Romance languages (Spanish \"hijo de puta,\" Italian \"figlio di puttana,\" French \"fils de pute\"), but in Portuguese, filho da puta has evolved the most versatile range of uses. It can express rage, shock, admiration, frustration, and even affection depending entirely on tone and context.\n\nThe Brazilian and Portuguese versions have diverged in usage style. In Brazil, \"filho da puta\" is extremely common in casual speech — Brazilian Portuguese is generally more profanity-tolerant than European Portuguese. A Brazilian might say \"puta que pariu\" (whore who gave birth) as a standalone exclamation of surprise, using the maternal insult format without directing it at anyone. European Portuguese tends to use \"filho da puta\" more pointedly and personally. Portuguese people also use the shortened form \"fdp\" in text messages and social media with the same frequency that English speakers use \"WTF\" — it's been fully absorbed into digital communication as an abbreviation that everyone reads as the full phrase.\n\nThe word achieved peak cultural visibility in Portuguese football. Portuguese and Brazilian football fans chanting \"filho da puta\" at referees is such a routine occurrence that UEFA and FIFA have specifically addressed Portuguese-language obscenity in stadium conduct guidelines. During the 2016 European Championship, which Portugal won, Cristiano Ronaldo was caught on camera shouting \"filho da puta\" in frustration during a match — the clip became one of the most-shared Portuguese-language videos on social media that year. In Brazilian funk music (funk carioca), the phrase appears in lyrics with extraordinary frequency, often used as punctuation or rhythmic filler rather than as a directed insult. The genre's relationship with profanity is itself a cultural statement: funk carioca emerged from Rio de Janeiro's favelas as music that deliberately refused to sanitize the language of its community.",
    regional_variations: [
      { region: "Brazil", severity: 4, note: "Extremely common. Brazilian Portuguese uses profanity more casually than European Portuguese. 'FDP' as abbreviation is ubiquitous in texts." },
      { region: "Portugal", severity: 4, note: "Same severity but used more deliberately. 'Filho da mãe' (son of the mother) serves as a common euphemism." },
      { region: "Angola/Mozambique", severity: 4, note: "Portuguese-speaking Africa uses it identically. The colonial linguistic inheritance includes the full profanity vocabulary." }
    ]
  },
  {
    id: "6becfcf1-c0c1-4dac-ad06-6ad439656c80", // gilipollas - Spanish
    example_sentences: [
      { original: "No seas gilipollas, tío, devuélvele el dinero.", translation: "Don't be an asshole, dude, give him his money back." },
      { original: "Menudo gilipollas, se ha saltado el semáforo.", translation: "What an idiot, he ran the red light." },
      { original: "Eres gilipollas si crees que eso va a funcionar.", translation: "You're a moron if you think that's going to work." },
      { original: "¡Gilipollas! ¡Que casi me tiras el café!", translation: "You idiot! You almost knocked my coffee over!" },
      { original: "Es un gilipollas integral, pero tiene suerte.", translation: "He's a complete dumbass, but he's lucky." }
    ],
    cultural_context: "Gilipollas is Spain's signature insult — as distinctly Spanish as paella or flamenco. Other Spanish-speaking countries either don't use it at all or barely recognize it, making it one of the strongest dialect markers in the Spanish language. A person who says \"gilipollas\" is immediately identifiable as Spanish (from Spain), not Latin American. The word describes a very specific type of foolishness: not just stupidity, but stupidity combined with arrogance, self-satisfaction, or obliviousness to one's own incompetence. The English equivalent would be closer to \"tool\" or \"twat\" than to simple \"idiot\" — it implies the person is not just wrong but annoyingly, cluelessly wrong.\n\nA 2020 study by Nebrija University in Madrid found gilipollas to be the most frequently used insult in Spain, ahead of \"imbécil\" and \"capullo.\" Its dominance is partly phonetic — the word has a satisfying rhythm (gi-li-PO-llas) that makes it pleasurable to say, especially when elongating the stressed syllable for emphasis (\"gili-POOOO-llas\"). Spanish speakers have noted that the word feels aerodynamic in the mouth, designed for shouting. The shortened form 'gil' is milder and more casual — calling someone \"un poco gil\" (a bit of a fool) barely registers as an insult, while \"gilipollas\" at full volume is a clear provocation.\n\nThe word's etymology is debated but the most accepted theory connects \"gili-\" to an Arabic or Romani root meaning foolish, combined with \"pollas\" (dicks/cocks). This would make gilipollas literally \"stupid-dicks\" — a compound insult with roots in Spain's multicultural linguistic history. The word appears in Spanish literature from the mid-20th century onward and became truly mainstream in the post-Franco democratic era (after 1975), when Spanish media and culture experienced a liberalization wave known as \"la Movida Madrileña.\" During this period, previously censored language flooded Spanish film, television, and music. Director Pedro Almodóvar's early films deployed gilipollas and other profanity as deliberate acts of cultural freedom, cementing the word's place in modern Spanish identity.",
    regional_variations: [
      { region: "Spain (nationwide)", severity: 3, note: "The most-used Spanish insult. Moderately offensive — rude but not fighting words in most contexts." },
      { region: "Latin America", severity: 1, note: "Barely recognized. Sounds distinctly Spanish/foreign. Latin American countries have their own equivalents (huevón, pendejo, boludo)." },
      { region: "Canary Islands", severity: 3, note: "Same usage as mainland Spain. Canarian Spanish shares peninsular profanity vocabulary." }
    ]
  },
  {
    id: "0dae96f2-c537-44fe-a590-fd952e0fbcbc", // douchebag - English
    example_sentences: [
      { original: "That guy in the BMW cutting everyone off is such a douchebag.", translation: "That guy in the BMW cutting everyone off is such a douchebag." },
      { original: "Stop being a douchebag and just apologize.", translation: "Stop being a douchebag and just apologize." },
      { original: "Every gym has that one douchebag who never wipes down the equipment.", translation: "Every gym has that one douchebag who never wipes down the equipment." },
      { original: "He showed up in a popped collar and aviators — peak douchebag energy.", translation: "He showed up in a popped collar and aviators — peak douchebag energy." },
      { original: "I can't believe I dated that douchebag for a year.", translation: "I can't believe I dated that douchebag for a year." }
    ],
    cultural_context: "Douchebag occupies a very specific niche in American English that no other insult fills exactly. It doesn't mean stupid (that's \"idiot\"), it doesn't mean cruel (that's \"asshole\"), and it doesn't mean socially awkward (that's \"weirdo\"). Douchebag describes a particular cocktail of unearned confidence, performative masculinity, and social obliviousness. The archetypal douchebag wears expensive clothes badly, talks loudly about money, hits on women aggressively, and genuinely believes everyone admires him. The word is as much a sociological category as an insult — saying \"he's a douchebag\" communicates a complete behavioral profile that every American immediately understands.\n\nThe word's literal meaning — a vaginal hygiene device — adds a layer of gendered complexity. Calling a man a douchebag is technically comparing him to a feminine hygiene product, implying he's both useless and associated with a process that is itself unnecessary (modern medicine considers douching unhelpful). This etymological feminization of the target is the inverse of most gendered insults, which work by feminizing women negatively. Douchebag feminizes men to diminish them — a rare pattern in English profanity. Despite this, the word is not generally considered misogynistic in practice; it's aimed at men and understood as attacking masculine behavior.\n\nThe word's golden era was roughly 2005-2015, when it became the internet's default term for a specific type of male behavior. College Humor, Deadspin, and countless blogs ran \"douchebag\" features identifying the species in the wild. The 2009 Jet Blue pilot who asked passengers to identify \"the douchebag in seat 12A\" went viral. The word appeared in academic papers analyzing fraternity culture and toxic masculinity. By the late 2010s, \"douchebag\" began losing ground to newer terms like \"bro\" (used dismissively) and \"toxic,\" but it remains instantly understood and is arguably the most 2000s-specific American insult — hearing someone say \"douchebag\" in 2026 carries a faint retro flavor, like hearing someone say \"gnarly\" or \"radical.\"",
    regional_variations: [
      { region: "United States", severity: 2, note: "Moderately offensive. Acceptable in casual speech, TV after watershed, and social media. More sociological observation than fighting words." },
      { region: "Canada", severity: 2, note: "Same usage and severity as American English. Fully integrated into Canadian English." },
      { region: "UK/Australia", severity: 1, note: "Understood but sounds distinctly American. British speakers prefer 'tosser,' 'bellend,' or 'wanker' for similar concepts." }
    ]
  },
  {
    id: "7f361f1c-d27c-4d2a-9c32-b200c21122cb", // BT - Chinese
    example_sentences: [
      { original: "你太BT了，居然吃这种东西。", translation: "You're so weird, you actually eat that stuff." },
      { original: "这个BT老板又让加班了。", translation: "This psycho boss is making us work overtime again." },
      { original: "BT！这游戏难度也太变态了吧。", translation: "Insane! This game's difficulty is absolutely psycho." },
      { original: "别那么BT好不好，正常点。", translation: "Stop being so freaky, be normal." },
      { original: "他那个BT行为把大家都吓到了。", translation: "His perverted behavior scared everyone." }
    ],
    cultural_context: "BT is the internet-age abbreviation of 变态 (biàntài), a word that literally means \"abnormal transformation\" but functions as Chinese for \"pervert,\" \"freak,\" or \"psycho\" depending on context. Like its cousin TMD, BT was born from the collision of Chinese profanity and internet censorship — typing the pinyin initials lets the word pass through automated character filters on platforms like Weibo, Baidu Tieba, and early QQ forums. But BT has evolved beyond mere censorship evasion. It's become its own word with a lighter feel than the full 变态, the way English speakers might write \"WTF\" in contexts where actually saying \"what the fuck\" would feel too heavy.\n\nThe full word 变态 carries genuinely different weight depending on context. Calling someone 变态 seriously — implying actual sexual deviance or predatory behavior — is a severe accusation in Chinese culture, where social reputation (面子, miànzi, face) is paramount. But calling a friend 变态 for eating an unusual food combination or having a strange hobby is lighthearted teasing. BT sits even lighter than the full word: it's almost always playful. \"你太BT了\" (you're so BT) between friends is closer to \"you're so weird\" than \"you're a pervert.\" This severity reduction through abbreviation is a pattern in Chinese internet language — the abbreviation creates emotional distance from the full word's meaning.\n\nBT gained particular traction in Chinese gaming culture, where it acquired a secondary meaning: \"overpowered\" or \"insanely difficult.\" Saying a boss fight is \"很BT\" (very BT) means it's brutally hard, not sexually deviant. A character build that's \"BT\" is broken-strong, unfairly powerful. This semantic drift — from \"pervert\" to \"extreme/insane\" — mirrors how English \"sick\" evolved from negative to positive (\"that's sick\" = that's amazing). Chinese internet slang evolves rapidly, and BT's gaming meaning has become so established that younger Chinese speakers sometimes use BT exclusively in the \"extreme/insane\" sense without ever connecting it to its original sexual meaning.",
    regional_variations: []
  }
];

async function main() {
  let succeeded = 0;
  let failed = 0;

  for (const entry of enrichments) {
    const updates = {};

    if (entry.example_sentences?.length > 0) {
      updates.example_sentences = entry.example_sentences;
    }
    if (entry.cultural_context) {
      updates.cultural_context = entry.cultural_context;
    }
    if (entry.regional_variations?.length > 0) {
      updates.regional_variations = entry.regional_variations;
    }

    if (Object.keys(updates).length === 0) {
      console.log(`SKIP ${entry.id} — no updates`);
      continue;
    }

    const { error } = await supabase
      .from("words")
      .update(updates)
      .eq("id", entry.id);

    if (error) {
      console.log(`FAIL ${entry.id}: ${error.message}`);
      failed++;
    } else {
      succeeded++;
      console.log(`OK   ${entry.id}`);
    }
  }

  console.log(`\nDone: ${succeeded} succeeded, ${failed} failed out of ${enrichments.length}`);
}

main().catch((e) => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
