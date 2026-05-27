// One-shot enrichment of 20 words using Claude-generated data.
// Run: node --env-file=.env scripts/enrich-claude-batch.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const enrichments = [
  {
    id: "24ce5f49-1eaa-4d52-8488-1d64a2fd38d4", // chingar - Spanish
    example_sentences: [
      { original: "¡No me chingues, güey! Te dije que no lo hicieras.", translation: "Don't fuck with me, dude! I told you not to do it." },
      { original: "Nos chingamos unas chelas después del trabajo, ¿no?", translation: "Let's knock back some beers after work, yeah?" },
      { original: "Me chingué el dedo abriendo la lata, qué ironía.", translation: "I fucked up my finger opening the can, how ironic." },
      { original: "Esa salsa está bien chingona, pásame más.", translation: "That salsa is fucking amazing, pass me more." },
      { original: "¡Chinga! Se me olvidó el pasaporte en el hotel.", translation: "Fuck! I left my passport at the hotel." }
    ],
    cultural_context: "Chingar is less a word and more an entire operating system for Mexican Spanish. It functions as verb, adjective, noun, and exclamation depending on conjugation and context. A teenager telling a friend \"no mames, no me chingues\" is barely swearing — it's just emphasis. But a stranger saying \"te voy a chingar\" in a bar is a direct physical threat. The generational divide is stark: grandparents might slap you for saying it at the dinner table, while millennials use \"chingón\" as a genuine compliment in job interviews at startups. Women use it freely among friends but face more social policing than men when using it publicly, especially in smaller towns.\n\nThe word spawns an entire ecosystem of derivatives that shift meaning dramatically. \"Chingón\" (badass/excellent) is almost positive. \"Chingadera\" (a worthless thing) is dismissive. \"Chingado\" (fucked/damned) is resigned frustration. \"A la chingada\" (to hell with it) is giving up. \"Hijo de la chingada\" (son of the fucked one) is fighting words. In northern Mexico, especially Monterrey, \"chingar\" competes with \"joder\" among educated speakers who consume more Spanish media, but \"chingar\" always wins in moments of genuine emotion.\n\nOctavio Paz dedicated an entire chapter of \"El laberinto de la soledad\" (1950) to analyzing \"los hijos de la chingada\" — the children of the violated woman — as the foundational metaphor of Mexican identity. He argued that the word encodes the trauma of the Conquest: La Malinche, Cortés's translator and mistress, became \"La Chingada,\" the violated mother of mestizo Mexico. This literary analysis elevated the word from street language to the subject of university seminars. In 2018, newly elected President López Obrador's supporters chanted \"¡Es un honor estar con Obrador!\" while his opponents shouted \"¡Chinga tu madre, AMLO!\" — the word functioning simultaneously as political protest and cultural catharsis on national television.",
    regional_variations: [
      { region: "Mexico (nationwide)", severity: 4, note: "The epicenter — chingar is the verb that holds Mexican Spanish profanity together. Severity drops to 2-3 when used as 'chingón' (awesome)." },
      { region: "Central America", severity: 3, note: "Used but less culturally loaded than in Mexico. Competes with local alternatives like 'joder' or 'pisar'." },
      { region: "Spain", severity: 2, note: "Understood but rarely used — 'joder' fills the same slot. Sounds distinctly Mexican to Spanish ears." },
      { region: "Argentina/Southern Cone", severity: 2, note: "Recognized from Mexican media but not part of daily vocabulary. 'Coger' and 'garchar' are the local equivalents." }
    ]
  },
  {
    id: "3bf3bb21-6069-4432-b644-f66c23174990", // 糞 (kuso) - Japanese
    example_sentences: [
      { original: "くそっ！電車に間に合わなかった！", translation: "Shit! I missed the train!" },
      { original: "あのクソゲー、もう二度とやらないわ。", translation: "That shitty game, I'm never playing it again." },
      { original: "くそ暑いな今日、溶けるわ。", translation: "It's fucking hot today, I'm melting." },
      { original: "クソワロタｗｗｗ", translation: "LMFAO (lit: shit-laughed) www" },
      { original: "くそ…マジかよ、これ本当なの？", translation: "Shit... Seriously, is this for real?" }
    ],
    cultural_context: "Kuso occupies a fascinating middle ground in Japanese profanity — it's genuinely vulgar enough that you wouldn't say it in a job interview, but mild enough that anime aimed at 12-year-olds uses it constantly. A salaryman muttering \"kuso\" after missing a deadline is unremarkable. The same salaryman screaming it at his boss would be career-ending, but that's more about the screaming than the word. Among younger speakers (teens through 30s), kuso functions almost identically to English \"fucking\" as a prefix intensifier: kusogatari (shitty hot), kusomajime (annoyingly serious), kusogaki (shitty brat). Older Japanese tend to use it only as an exclamation, not a modifier.\n\nThe internet transformed kuso into something broader. \"Kusoge\" (クソゲー, shitty game) became an entire review genre — there are dedicated YouTubers who only play kusoge. \"Kusowaro\" (クソワロ, shit-laughing) means laughing uncontrollably. The compound \"kusomiso\" (shit-miso, mixing garbage together) describes something so chaotically bad it's entertaining. Online, kuso lost almost all its sting and became more like punctuation. In text messages and on platforms like 2channel and Twitter, it reads as casual emphasis rather than genuine profanity.\n\nThe word has an unexpectedly literary pedigree. It appears in classical texts as early as the Heian period, though written with different kanji. In the famous 1960 film \"Yojimbo\" by Akira Kurosawa, Toshiro Mifune's ronin character uses \"kuso\" at a pivotal moment that shocked contemporary audiences — not because the word was unknown, but because samurai characters in films simply didn't talk like that. Kurosawa was deliberately breaking the fourth wall of historical respectability. Today, the word is so embedded in gaming and anime culture that non-Japanese speakers often learn it before \"hello\" — it's probably the single most internationally recognized Japanese swear word thanks to subtitle culture.",
    regional_variations: [
      { region: "Kanto (Tokyo)", severity: 3, note: "Standard usage — vulgar but common. Used freely in casual male speech." },
      { region: "Kansai (Osaka)", severity: 2, note: "Slightly less impactful because Kansai dialect has its own rich set of profanity. 'Aho' and 'akan' carry more weight locally." }
    ]
  },
  {
    id: "5dcd8cdf-27d3-47b0-9dfd-f06e3aa1cb96", // пизда (pizda) - Russian
    example_sentences: [
      { original: "Всё, пиздец, проект накрылся.", translation: "That's it, it's all fucked, the project is dead." },
      { original: "Хватит пиздеть, делай уже.", translation: "Stop talking shit and just do it already." },
      { original: "Он опиздюлился конкретно — ходить не может.", translation: "He got his ass kicked badly — can't even walk." },
      { original: "Пиздатая погода сегодня, пойдём гулять.", translation: "The weather's fucking great today, let's go for a walk." },
      { original: "Пизда рулю! Ты видел эту яму?!", translation: "The steering is fucked! Did you see that pothole?!" }
    ],
    cultural_context: "Pizda is one of the four foundational roots of Russian mat (the others being хуй, ебать, and блядь). Unlike English where \"cunt\" is primarily a standalone insult, pizda in Russian is a root morpheme that generates dozens of derivative words, each with distinct meaning. \"Пиздец\" (pizdets) means catastrophic finality — \"ему пиздец\" means \"he's completely done for.\" \"Пиздеть\" (pizdet') means to lie or talk nonsense. \"Пиздатый\" (pizdaty) paradoxically means excellent or awesome. \"Опиздюлить\" means to beat someone up. A native speaker doesn't think of these as variations of \"cunt\" — they're separate words that happen to share an etymological root, the way English speakers don't connect \"understand\" to \"stand.\"\n\nThe taboo around pizda is specifically tied to its anatomical meaning — the derivatives have shed that association almost entirely. A construction worker saying \"пиздатая работа\" (great job) isn't making a sexual reference any more than an English speaker saying \"that sucks\" is referencing oral sex. But the base word itself remains maximally taboo. Russian television bleeps it completely; even liberal-leaning internet publications will write \"п***а\" rather than spell it out. In mixed company, people substitute \"писец\" (a fur-bearing animal) or \"пипец\" — everyone knows what you mean, but the social contract of not saying the actual word is preserved.\n\nLinguists trace pizda to Proto-Slavic *pizda, with possible connections to Proto-Indo-European *pisda (to sit), suggesting an ancient euphemism for female anatomy based on the sitting position. The word appears across virtually all Slavic languages — Polish \"pizda,\" Czech \"pizda,\" Serbian \"pizda\" — making it one of the most stable swear words in the Slavic family, surviving over a thousand years of linguistic divergence. In Mikhail Lermontov's unpublished poem \"Юнкерская молитва\" (Junker's Prayer, 1834), the word appears in print — scholars debate whether this was Lermontov's genuine voice or a literary exercise, but the poem circulated in manuscript form for decades before anyone dared typeset it.",
    regional_variations: [
      { region: "Russia (urban)", severity: 5, note: "Maximally taboo as standalone word. Derivatives like 'pizdets' and 'pizdato' are severity 3-4 depending on context." },
      { region: "Ukraine", severity: 5, note: "Same root word exists in Ukrainian (пизда). Equally taboo, same derivative system." },
      { region: "Belarus", severity: 5, note: "Used identically to Russian — mat vocabulary is largely shared across East Slavic languages." }
    ]
  },
  {
    id: "d010f220-9aee-4210-99e1-dff18e253d1e", // كسّ (Kuss) - Arabic
    example_sentences: [
      { original: "كسّ! نسيت المحفظة بالبيت", translation: "Fuck! I forgot my wallet at home." },
      { original: "شو هالكسّ يللي عم بصير هون؟", translation: "What the fuck is going on here?" },
      { original: "كسّ أخت هالشغل، خلص ما بقدر", translation: "Fuck this job, I can't take it anymore." },
      { original: "يا كسّ، هاد أحلى أكل بحياتي", translation: "Holy shit, this is the best food I've ever had." },
      { original: "كسّ... ما توقعت هيك نتيجة أبداً", translation: "Fuck... I never expected this result at all." }
    ],
    cultural_context: "Kuss as a standalone exclamation functions differently than its compound forms (kuss ummak, kuss ukhtak). When someone stubs their toe and shouts \"kuss!\" they're not directing the insult at anyone's mother or sister — it's pure expletive, like shouting \"fuck!\" in English. But the word carries so much taboo weight from its anatomical meaning and its compound forms that even this neutral usage shocks bystanders. In Levantine Arabic (Lebanon, Syria, Jordan, Palestine), younger men might drop \"kuss\" into conversation the way Americans use \"shit\" — frequently and with diminished impact. But doing this around anyone over 50, or in any Gulf country, would be genuinely scandalous. Women almost never use the word in any Arabic-speaking country, and hearing a woman say it publicly would stop a room.\n\nThe censorship ecosystem around kuss is elaborate and culturally revealing. Written Arabic has developed multiple evasion strategies: \"ك**\" with asterisks, \"كـ ـس\" with a space breaking the word, switching to Latin script as \"kss\" or just \"K,\" or the creative euphemism \"كلمة بحرف الكاف\" (a word starting with K). Arab internet culture treats these workarounds as a shared joke — everyone knows exactly what's meant, but the act of not writing it preserves deniability. This is especially important because in several Gulf states, social media posts containing explicit profanity can result in actual legal consequences, including fines under cybercrime laws.\n\nThe word's ancestry is genuinely ancient. Cognates appear in Akkadian (the language of Babylon, circa 2000 BCE) and Aramaic, making kuss and its relatives among the oldest continuously used vulgarities in human language — a roughly 4,000-year-old swear word. The Arabic linguistic tradition itself has documented the word since at least the medieval period; the 11th-century philologist Ibn Manzur included it in his encyclopedic dictionary \"Lisan al-Arab,\" treating it as standard (if vulgar) vocabulary deserving scholarly documentation. This scholarly tradition of cataloguing profanity contrasts sharply with the modern media taboo.",
    regional_variations: [
      { region: "Levant (Lebanon, Syria, Jordan)", severity: 4, note: "Used as standalone exclamation among young men. Less taboo than Gulf but still very vulgar." },
      { region: "Gulf States (Saudi, UAE, Kuwait)", severity: 5, note: "Maximally taboo. Can result in legal issues if posted on social media. Never used casually." },
      { region: "Egypt", severity: 5, note: "Extremely offensive. Egyptian Arabic prefers its own vulgarities; kuss is recognized but hits harder because it's less common in daily speech." },
      { region: "North Africa (Morocco, Tunisia)", severity: 4, note: "The Maghreb equivalent 'kiss' is used similarly but local dialect differences soften it slightly compared to Levantine usage." }
    ]
  },
  {
    id: "042bf587-398b-4f6f-8069-a5f29e6b606b", // memek - Indonesian
    example_sentences: [
      { original: "Jangan ngomong memek di depan ibu, goblok!", translation: "Don't say 'memek' in front of mom, you idiot!" },
      { original: "Dasar mulut memek, bisanya cuma ngomong jorok.", translation: "You've got a filthy mouth, all you can do is talk dirty." },
      { original: "Memek lu! Gue hampir ketabrak gara-gara elu!", translation: "You cunt! I almost got hit because of you!" },
      { original: "Film itu banyak banget adegan memeknya, parah.", translation: "That movie had way too many explicit scenes, it was awful." },
      { original: "Memek! Gue kaget, anjing!", translation: "Fuck! You scared me, damn!" }
    ],
    cultural_context: "Memek sits at the very top of Indonesian profanity — it's the word that makes other swear words look polite by comparison. While \"anjing\" (dog) and \"bangsat\" (scoundrel) flow freely in Jakarta traffic, memek is reserved for genuine rage or deliberately crossing a line. In a country where Islamic cultural values shape public discourse and broadcasting standards, anatomical terms for female genitalia carry extraordinary weight. A comedian using \"anjing\" on stage gets laughs; one using \"memek\" gets pulled off stage. The gender dynamic is pronounced — men who use it are seen as crass but are socially tolerated, while a woman using it publicly faces intense judgment and is often labeled as \"tidak bermoral\" (without morals).\n\nThe word has almost no casual or playful register. Unlike English \"cunt\" which has been partially reclaimed in Australian and British slang, or Indonesian \"anjing\" which functions as casual punctuation among Jakarta teens, memek stays locked in its most offensive mode. You won't hear it in pop music, it doesn't appear in mainstream films (even R-rated Indonesian horror films avoid it), and social media platforms with Indonesian content moderation flag it immediately. The only context where it circulates freely is in crude male humor among close friends, usually in private WhatsApp groups rather than public posts.\n\nIndonesian internet culture has developed specific euphemisms: \"m*m*k\" with asterisks, \"me2\" using numbers, or just \"M-word.\" The word gained unexpected international attention in 2019 when a viral Indonesian TikTok sound included it, leading to confused non-Indonesian users asking what it meant — which in turn spawned explanation videos that became their own viral phenomenon. The linguistic taboo is strong enough that Indonesian language learning resources universally exclude it, and even dictionaries marketed as \"complete\" often omit it entirely.",
    regional_variations: [
      { region: "Jakarta/Java", severity: 5, note: "Maximum offense. The Betawi dialect community considers it among the most extreme words available." },
      { region: "Sumatra", severity: 5, note: "Equally taboo. Regional languages have their own equivalents but memek in Indonesian carries the same weight everywhere." },
      { region: "Bali", severity: 4, note: "Slightly less explosive because Balinese culture has its own profanity system in Balinese language, but still very offensive in Indonesian." }
    ]
  },
  {
    id: "496370c4-ea2a-4ae3-a44a-26ec39f31b2c", // toket - Indonesian
    example_sentences: [
      { original: "Jangan liatin toket orang, dasar mesum!", translation: "Stop staring at her tits, you pervert!" },
      { original: "Toketnya gede banget, bro. Asli apa palsu tuh?", translation: "Her tits are huge, bro. Real or fake?" },
      { original: "Gue disuruh push-up sampe toket gue sakit.", translation: "I was told to do push-ups until my chest hurt." },
      { original: "Film itu mah cuma jualan toket doang, ceritanya kosong.", translation: "That movie is just selling tits, the story is empty." },
      { original: "Toket! Kaget gue, kirain ada apa.", translation: "Damn! You scared me, I thought something happened." }
    ],
    cultural_context: "Toket is the quintessential locker-room word in Indonesian — crude, juvenile, and immediately marking the speaker as someone not trying to impress anyone with manners. The \"proper\" Indonesian word for breasts is \"payudara\" (used in medical and formal contexts) and the everyday word is \"susu\" (which also means milk, creating the same double meaning as in many languages). Toket exists purely in the vulgar register. Boys typically learn it around age 10-12 from older kids, and it dominates the vocabulary of teenage male humor. Among adult men, using it signals you're in a casual, all-male space where politeness has been suspended.\n\nThe word is almost exclusively used by men. Indonesian women referring to breasts in casual conversation would use \"susu\" or the more clinical \"payudara,\" or sometimes the English loanword \"boobs\" which has been adopted into urban Indonesian slang as somehow less vulgar than the native term. This linguistic hierarchy — where a borrowed English word is considered more acceptable than the Indonesian equivalent — reflects how English functions as a social lubricant for taboo topics in urban Indonesian culture. You'll see Instagram captions using \"boobs\" where \"toket\" would get the post reported.\n\nToket appears frequently in Indonesian meme culture, especially in the genre of \"meme dewasa\" (adult memes) shared in male-dominated Facebook groups and WhatsApp chats. The 2010s saw a wave of Indonesian YouTube pranks with titles like \"Prank Toket\" that tested public reactions to the word — most involved hidden-camera scenarios where someone said \"toket\" loudly in public and filmed bystanders' horrified reactions. These videos regularly hit millions of views, suggesting the word's taboo status is itself a source of entertainment value.",
    regional_variations: []
  },
  {
    id: "2fdd1cd9-7241-4aca-9029-5fd2940c996a", // kiss my ass - English
    example_sentences: [
      { original: "You don't like my presentation? Kiss my ass.", translation: "You don't like my presentation? Kiss my ass." },
      { original: "Tell HR they can kiss my ass — I'm not working weekends.", translation: "Tell HR they can kiss my ass — I'm not working weekends." },
      { original: "He told his landlord to kiss his ass and moved out that night.", translation: "He told his landlord to kiss his ass and moved out that night." },
      { original: "Kiss my ass, I called shotgun first!", translation: "Kiss my ass, I called shotgun first!" },
      { original: "They want me to apologize? They can kiss my entire ass.", translation: "They want me to apologize? They can kiss my entire ass." }
    ],
    cultural_context: "\"Kiss my ass\" occupies the sweet spot of English profanity — offensive enough to make a point, mild enough that it appears on network television after 9 PM. It's a defiance phrase rather than a true insult: the speaker isn't actually requesting the act, they're declaring total contempt for someone's authority or opinion. The emphasis is on the refusal, not the anatomy. Adults use it in workplaces (after quitting, usually), in traffic, and in arguments where they want to escalate without crossing into the really heavy stuff. Among friends, it's practically affectionate — \"oh, kiss my ass\" after a good-natured insult is a standard American exchange that signals \"you got me, but I'm not actually mad.\"\n\nThe phrase has a formal-informal split that's distinctly American. \"Kiss my ass\" is the everyday version. \"You can kiss my ass\" is slightly more deliberate and controlled. \"Kiss my entire ass\" is a 2010s intensification that adds comic emphasis. \"You may kiss my ass\" is mock-formal, used for comedic effect. And the Southern US version — \"well, you can just kiss my grits\" — is a minced oath that became famous through the TV show \"Alice\" (1976-1985), where waitress Flo's catchphrase \"kiss my grits\" became a national phenomenon precisely because everyone knew what she really meant.\n\nThe phrase appears in Geoffrey Chaucer's \"The Miller's Tale\" (c. 1390), where a character literally kisses another's rear end in a bawdy prank involving a window — making it one of the oldest documented English insults still in active daily use. In 1977, Elvis Presley's final concert tour included a moment where he told a heckler to \"kiss my ass\" — the recording circulated on bootleg tapes and became legendary among fans. The phrase crossed into political history when Vice President Dick Cheney told Senator Patrick Leahy to \"go fuck yourself\" on the Senate floor in 2004 — had he said \"kiss my ass\" instead, it would have barely made the news, illustrating exactly where the phrase sits on the severity scale.",
    regional_variations: [
      { region: "UK", severity: 3, note: "'Kiss my arse' is the British equivalent — slightly earthier sounding but same severity. 'Arse' is the native English form; 'ass' is the American innovation." },
      { region: "Australia", severity: 2, note: "Mild in Australian context where much harder language is casual. Often shortened to just 'get stuffed' or 'rack off' which carry similar energy." },
      { region: "Southern US", severity: 2, note: "'Kiss my grits' and 'kiss my behind' are common minced versions. The full phrase is standard but carries less shock value due to the region's rich profanity tradition." }
    ]
  },
  {
    id: "c8dc9f45-d795-4801-82f6-98b67af93851", // チョン (chon) - Japanese
    example_sentences: [
      { original: "あいつはネットでチョンとか平気で書くやつだ。", translation: "He's the type who writes slurs like 'chon' online without hesitation." },
      { original: "「チョン」って言葉、学校で使ったら即退学だぞ。", translation: "If you use the word 'chon' at school, you'll be expelled immediately." },
      { original: "掲示板でチョンチョン連呼してるやつ、通報した。", translation: "I reported the guy spamming 'chon' on the message board." },
      { original: "おじいちゃんがチョンって言うたび、気まずくなる。", translation: "Every time grandpa says 'chon,' it gets awkward." },
      { original: "チョンとか言ってる時点で、議論する価値ないわ。", translation: "The moment someone says 'chon,' they're not worth arguing with." }
    ],
    cultural_context: "This is a word that exists primarily to wound, and understanding it requires understanding the deep, complicated history between Japan and Korea. Japan colonized Korea from 1910 to 1945, and the ethnic Korean population that remained in Japan after the war — the Zainichi Koreans — faced systematic discrimination in housing, employment, and education for decades. \"Chon\" became the verbal weapon of that discrimination. It reduces an entire ethnic identity to a slur, and its use in modern Japan is an immediate marker of far-right nationalism or outright racism. There is no casual or playful register for this word. Using it in a Japanese workplace would result in termination; using it in public could lead to confrontation or police involvement.\n\nThe word gained a second life on Japanese internet forums, particularly 2channel (now 5channel), where anonymous posting enabled a strain of anti-Korean hate speech that became known as \"netto-uyoku\" (internet right-wing). In these spaces, \"chon\" became shorthand for a broader xenophobic worldview that blamed Korean residents for various social problems. The Japanese government responded with the Hate Speech Elimination Act of 2016 (ヘイトスピーチ解消法), which specifically targeted language like this — though the law lacks criminal penalties, it gave municipalities legal ground to deny permits to hate-speech rallies and remove online content.\n\nThe historical derivation from \"Chōsen\" (朝鮮, the Japanese name for Korea) is itself politically charged. The name \"Chōsen\" is associated with the colonial period, and modern South Korea is referred to as \"Kankoku\" (韓国) in Japanese. Using \"Chōsen\" instead of \"Kankoku\" already signals a specific political stance. Shortening it further to \"chon\" strips away even the pretense of geography and turns an ethnicity into a slur. In 2013, the United Nations Committee on the Elimination of Racial Discrimination specifically cited anti-Korean hate speech in Japan — including this term — in its recommendations to the Japanese government, marking it as an international human rights concern rather than a purely domestic linguistic issue.",
    regional_variations: []
  },
  {
    id: "7d024794-33f6-473c-a771-162ecdc8d7f4", // 개새끼 (gaesaekki) - Korean
    example_sentences: [
      { original: "이 개새끼가 또 거짓말하네.", translation: "This son of a bitch is lying again." },
      { original: "야, 개새끼야, 장난이었어 ㅋㅋ", translation: "Hey, you bastard, I was kidding lol" },
      { original: "그 개새끼 때문에 프로젝트 다 망했어.", translation: "That son of a bitch ruined the entire project." },
      { original: "아 개새끼... 이게 뭐야 진짜.", translation: "Ah, son of a bitch... what the hell is this." },
      { original: "개새끼! 깜짝이야!", translation: "Son of a bitch! You scared the hell out of me!" }
    ],
    cultural_context: "Gaesaekki is the Korean insult that appears in virtually every Korean drama, film, and rap song that wants to signal real anger. It translates literally as \"dog's offspring\" — combining 개 (gae, dog) with 새끼 (saekki, offspring/baby animal). In Korean culture, comparing someone to a dog is deeply degrading because dogs were historically considered lowly animals, not the beloved pets of Western culture. Calling someone a dog's offspring attacks their lineage and their parents simultaneously, which in a Confucian society that places enormous emphasis on family honor, cuts deep. Among men in their 20s and 30s, though, it functions almost like \"dude\" or \"bastard\" in the affectionate sense — \"야 개새끼야\" between close friends at a bar is basically a greeting.\n\nThe word has a complex internal structure that Korean speakers manipulate for emphasis. \"새끼\" alone means offspring or baby animal and is already a mild insult (roughly \"punk\" or \"little shit\"). Adding \"개\" (dog) in front escalates it. But Korean allows further stacking: \"씹개새끼\" adds the profanity prefix 씹 (from 씹하다, to have sex) for maximum offense, and \"미친개새끼\" adds \"crazy\" on top. The modularity of Korean profanity means speakers can fine-tune exactly how offensive they want to be, like adjusting a volume dial. This grammatical flexibility is part of why Korean swearing feels so expressive to native speakers — the language gives you precision tools for insults.\n\nThe word exploded into international awareness through Korean cinema, particularly Park Chan-wook's \"Oldboy\" (2003) and Bong Joon-ho's \"Parasite\" (2019), where English subtitles translated it variously as \"bastard,\" \"son of a bitch,\" or just \"asshole\" — none of which fully capture the cultural weight of the dog comparison. K-drama fans worldwide now recognize it by sound even without subtitles. In 2020, a viral clip showed a Korean grandmother scolding her grandson by calling him \"이 개새끼야\" while simultaneously feeding him soup, perfectly capturing the word's dual nature as both genuine insult and frustrated term of endearment depending entirely on tone and context.",
    regional_variations: [
      { region: "Seoul/Standard Korean", severity: 4, note: "Strong insult when directed at strangers; casual among close male friends. Severity swings enormously based on tone." },
      { region: "Gyeongsang (Busan/Daegu)", severity: 3, note: "The satoori (regional dialect) of southeastern Korea uses profanity more freely in daily speech. Gaesaekki lands with less shock here." },
      { region: "North Korea", severity: 4, note: "Same word exists but the profanity landscape differs. State media has used it in official propaganda against political enemies, giving it a more formal-aggressive register." }
    ]
  },
  {
    id: "d2869ab8-9863-4f38-9b1d-1358bd626c25", // ngentot - Indonesian
    example_sentences: [
      { original: "Ngentot lu! Hampir nabrak gue!", translation: "Fuck you! You almost hit me!" },
      { original: "Gue nggak mau ngentot sama urusan kantor lagi.", translation: "I don't want to deal with office bullshit anymore." },
      { original: "Dasar tukang ngentot, nggak bisa dipercaya.", translation: "You fucking scumbag, can't be trusted." },
      { original: "Ngentot! WiFi mati lagi pas lagi meeting.", translation: "Fuck! The WiFi died again during a meeting." },
      { original: "Dia bilang 'ngentot' di depan guru, langsung dipanggil orang tua.", translation: "He said 'ngentot' in front of the teacher, his parents got called in immediately." }
    ],
    cultural_context: "Ngentot is the Indonesian equivalent of \"fuck\" in its most direct, sexual sense — it literally means the act of sexual intercourse. In a country where public morality laws intersect with profanity (Indonesia's Information and Electronic Transactions Law, UU ITE, has been used to prosecute people for online obscenity), ngentot sits in legally dangerous territory. It's not just socially unacceptable — posting it on social media has, in documented cases, contributed to criminal charges. This legal dimension gives the word a weight that English \"fuck\" has largely lost through overuse. When an Indonesian person uses ngentot, they're not just being rude; depending on context, they might be committing a misdemeanor.\n\nThe word functions primarily as a verb (to fuck) but has been pressed into service as an exclamation and general intensifier, especially in Jakarta's street slang. In Betawi (the native dialect of Jakarta), profanity flows more freely than in other Indonesian communities, and ngentot competes with \"anjing,\" \"bangsat,\" and \"kampret\" in the daily vocabulary of frustrated commuters and construction workers. But even in Jakarta, ngentot is understood to be a tier above those words. A becak driver might shout \"anjing!\" at a car that cuts him off; escalating to \"ngentot\" signals genuine rage or threat. The word rarely appears in Indonesian music, film, or literature — even edgy Indonesian punk bands tend to avoid it in lyrics, preferring \"bajingan\" or English loanword profanity instead.\n\nThe word's taboo is reinforced by Indonesia's complex relationship with sexuality and public discourse. The Indonesian Broadcasting Commission (KPI) maintains strict content guidelines that would never permit the word on television or radio. When Indonesian YouTube creators use it, they typically bleep it or substitute \"n-word\" style censoring (\"ng*nt*t\"). The word has no euphemistic form — unlike \"anjir\" for \"anjing\" or \"kampret\" for a stronger term, there's no softened version of ngentot that preserves the meaning while reducing the offense. You either say it or you don't, which keeps its shock value permanently high.",
    regional_variations: [
      { region: "Jakarta/Betawi", severity: 5, note: "Epicenter of usage. Betawi slang incorporates it but even here it's top-tier profanity." },
      { region: "Java (non-Jakarta)", severity: 5, note: "Javanese speakers may prefer Javanese-language equivalents in daily speech but recognize ngentot as maximally offensive in Indonesian." },
      { region: "Eastern Indonesia (Papua, Maluku)", severity: 5, note: "Less commonly used in daily speech — local languages dominate profanity — but understood and considered extremely offensive when heard in Indonesian." }
    ]
  },
  {
    id: "b394eb5a-1a77-4c89-8976-58460284cb74", // Schlampe - German
    example_sentences: [
      { original: "Nenn mich noch einmal Schlampe und du fliegst raus.", translation: "Call me Schlampe one more time and you're out." },
      { original: "Die ist doch keine Schlampe, du kennst sie gar nicht.", translation: "She's not a slut, you don't even know her." },
      { original: "Er hat mich Schlampe genannt — vor allen Leuten.", translation: "He called me a slut — in front of everyone." },
      { original: "Jede Frau, die ausgeht, ist direkt eine Schlampe, oder was?", translation: "Every woman who goes out is automatically a slut, is that it?" },
      { original: "Schlampe, bitte. Die war einmal bei einem Date.", translation: "Slut, please. She went on one date." }
    ],
    cultural_context: "Schlampe is one of the most gendered insults in German — it's applied almost exclusively to women and carries a double payload of sexual shaming and personal disgust. The word originally meant a slovenly, unkempt woman (related to \"schlampig,\" meaning sloppy or messy), and that older meaning hasn't fully disappeared. Calling someone a Schlampe implies not just promiscuity but a general lack of self-respect and hygiene. This makes it arguably more personally degrading than English \"slut,\" which has been partially neutralized through reclamation movements like SlutWalk. In German, no equivalent reclamation has occurred — Schlampe remains firmly in the insult category across all demographics and age groups.\n\nThe word's severity depends heavily on who's saying it and to whom. In the context of a breakup argument, it's a devastating personal attack — German family courts have cited the use of \"Schlampe\" in custody proceedings as evidence of a hostile environment. Among teenage boys talking about girls they don't like, it circulates with depressing frequency but is understood even by them to be a serious insult, not casual banter. Interestingly, German rap (Deutschrap) uses it fairly often — artists like Bushido and Kollegah have deployed \"Schlampe\" in lyrics that would trigger content warnings in any other medium, but the genre's deliberately provocative stance gives it cover. Outside of rap, the word essentially doesn't appear in German media.\n\nGerman has a precise insult hierarchy for women that Schlampe sits near the top of. \"Tussi\" (bimbo) is dismissive but not devastating. \"Miststück\" (piece of manure) is angry but not sexual. \"Hure\" (whore) is the most extreme — it's a direct prostitution accusation. \"Schlampe\" falls between Miststück and Hure: worse than calling someone a bimbo, but not quite as nuclear as calling them a prostitute. This gradation matters in German culture, where the specificity of an insult signals how much thought went into it. Calling someone a Schlampe in cold blood, rather than in the heat of an argument, is considered worse precisely because it implies deliberation.",
    regional_variations: [
      { region: "Germany (nationwide)", severity: 4, note: "Consistently offensive across all German-speaking regions. No regional softening." },
      { region: "Austria", severity: 4, note: "Same word, same weight. Austrian German has its own insults (Tschecherant, etc.) but Schlampe functions identically." },
      { region: "Switzerland", severity: 4, note: "Swiss German speakers would use the Mundart form in dialect but the standard German 'Schlampe' is equally understood and offensive." }
    ]
  },
  {
    id: "308438a2-3112-4085-a6c6-5090768be2c6", // putang ina - Filipino
    example_sentences: [
      { original: "Putang ina! Ang laki ng ipis na 'yon!", translation: "Son of a bitch! That cockroach is huge!" },
      { original: "Putang ina mo, bakit mo sinabi 'yun?", translation: "You son of a bitch, why did you say that?" },
      { original: "Hahaha putang ina, ang galing mo naman!", translation: "Hahaha holy shit, you're so good!" },
      { original: "Putang ina naman, bagsak na naman WiFi.", translation: "Motherfucker, the WiFi's down again." },
      { original: "P*tang ina, di ko kinaya 'yung exam.", translation: "Fuck, I couldn't handle that exam." }
    ],
    cultural_context: "Putang ina — often shortened to \"P.I.,\" \"puta,\" \"tang ina,\" \"tangina,\" or just \"'nak\" in rapid speech — is the undisputed king of Filipino profanity. It translates literally as \"your mother is a whore\" (from Spanish \"puta\" + Tagalog \"ina,\" mother), but its actual function in daily Filipino speech has almost nothing to do with anyone's mother. It's an all-purpose exclamation that covers surprise, anger, joy, frustration, admiration, and disbelief. A Filipino gamer landing a clutch play shouts \"TANG INA!\" in celebration. A commuter watching their jeepney pull away mutters \"tang ina\" in resignation. The phrase is so embedded in Filipino communication that sociolinguists have described it as having grammaticalized — it's less a phrase and more a particle of emotional emphasis.\n\nThe critical distinction is between \"putang ina\" (standalone exclamation) and \"putang ina mo\" (directed at someone). Adding \"mo\" (your) transforms it from a general exclamation into a personal attack — the difference between shouting \"fuck!\" when you drop your phone and saying \"fuck you\" to someone's face. Filipino speakers navigate this distinction instinctively, but it confuses foreigners who hear the phrase constantly and assume it's always aggressive. In professional settings, educated Filipinos might use the abbreviation \"P.I.\" or the minced version \"pucha\" (like \"shoot\" for \"shit\" in English) — everyone knows what it stands for, but the social contract of substitution is maintained.\n\nThe word's Spanish colonial heritage is visible in its DNA — \"puta\" is directly from Spanish, grafted onto Tagalog grammar. This makes it part of a larger class of Filipino profanity inherited from 333 years of Spanish rule. But the Filipino version has evolved far beyond its Spanish source material. In Spain, \"puta madre\" is vulgar but conventional. In the Philippines, \"putang ina\" has become the emotional backbone of online Filipino culture — it's the most-used Filipino phrase in international gaming communities (especially in DOTA 2 and Mobile Legends, where Filipino players are a massive demographic), and \"PUTANGINA\" in all-caps has become recognizable internet slang even to non-Filipino gamers across Southeast Asia. In 2016, President Rodrigo Duterte used it in a speech referring to the Pope, creating an international incident that simultaneously scandalized diplomatic circles and endeared him to his base — encapsulating the word's dual nature as both maximally offensive and authentically Filipino.",
    regional_variations: [
      { region: "Metro Manila/Tagalog regions", severity: 5, note: "Home base. Used constantly in casual speech but severity skyrockets when 'mo' is added or when directed at elders." },
      { region: "Visayas (Cebu, Iloilo)", severity: 4, note: "Understood but Bisaya speakers have their own equivalent — 'yawa' (devil) and 'bilat' (vulva) — which carry more local weight." },
      { region: "Mindanao", severity: 5, note: "Same impact. In Muslim-majority areas, the sexual/maternal insult dimension makes it even more culturally explosive." }
    ]
  },
  {
    id: "e3d4c8c4-cef1-4dc8-a7af-1a08e3ab6b00", // concha - Spanish
    example_sentences: [
      { original: "¡La concha de tu madre, casi me atropellás!", translation: "Your mother's cunt, you almost ran me over!" },
      { original: "¿Qué concha hacés acá a esta hora?", translation: "What the fuck are you doing here at this hour?" },
      { original: "Concha, se me cayó el celular al inodoro.", translation: "Fuck, I dropped my phone in the toilet." },
      { original: "No me rompas la concha con eso otra vez.", translation: "Don't break my balls about that again." },
      { original: "¡Concha! No sabía que eras vos, casi te pego.", translation: "Shit! I didn't know it was you, I almost hit you." }
    ],
    cultural_context: "Concha is one of the most spectacular false friends in the Spanish-speaking world. In Spain, it's a seashell, a common woman's name (short for Concepción), and a type of bread. In Argentina, Uruguay, and Chile, it's one of the most vulgar words in the language — the equivalent of \"cunt\" in English. The potential for catastrophic miscommunication is enormous and well-documented. Spanish tourists in Buenos Aires asking for \"conchas\" at a bakery become an evergreen comedy bit among Argentine comedians. A Mexican ordering a \"concha\" (a sweet bread topped with a shell-pattern crust) at a Buenos Aires café would get stares. And an Argentine woman named Concha visiting Spain discovers her name is completely normal there while being the equivalent of being named \"Pussy\" back home.\n\nThe full phrase \"la concha de tu madre\" (your mother's cunt) is the ultimate Argentine insult — it attacks the listener's mother with the most taboo anatomical term available. But \"concha\" alone has also evolved into a standalone exclamation, like dropping \"fuck\" as a reaction. In Buenos Aires street speech, particularly among men, \"¡concha!\" functions as pure surprise or frustration with no anatomical imagery intended by the speaker. The word also appears in the milder substitute \"¡la concha de la lora!\" (the parrot's cunt), which is absurd enough to function as a minced oath — roughly equivalent to saying \"son of a gun\" instead of \"son of a bitch.\" The parrot version is acceptable in mixed company where the original would not be.\n\nThe word's geographic landmine status has created real diplomatic and commercial headaches. When Volkswagen launched the car model \"Concha\" in Latin American markets, they had to quickly rebrand in the Southern Cone. Argentine soccer fans chanting about \"la concha\" of the opposing team's mother is a stadium staple that baffles European commentators unfamiliar with the term. In 2017, a viral video showed an Argentine exchange student in Spain trying to explain to her horrified host family why she burst out laughing when they offered her a concha for breakfast — the clip accumulated millions of views precisely because it captured the collision of two completely different linguistic realities sharing the same word.",
    regional_variations: [
      { region: "Argentina/Uruguay", severity: 4, note: "Maximally vulgar — equivalent to 'cunt.' The phrase 'la concha de tu madre' is the apex Argentine insult." },
      { region: "Chile", severity: 4, note: "Same vulgar meaning as in Argentina. 'Conchetumadre' runs together as a single compound exclamation." },
      { region: "Spain", severity: 1, note: "Completely innocent — means seashell or is a woman's name. No vulgar connotation whatsoever." },
      { region: "Mexico/Central America", severity: 1, note: "Means a type of sweet bread. No vulgar meaning. Mexican travelers in Argentina learn this the hard way." }
    ]
  },
  {
    id: "70962f33-5916-49c7-b64e-bc33212ba221", // TMD - Chinese
    example_sentences: [
      { original: "TMD，又输了一把。", translation: "Damn it, lost another round." },
      { original: "TMD这个bug怎么还没修？", translation: "FFS, how has this bug not been fixed yet?" },
      { original: "我TMD真的受不了这个人了。", translation: "I honestly fucking can't stand this person anymore." },
      { original: "TMD太好笑了哈哈哈", translation: "Fucking hilarious lmao" },
      { original: "TMD！快递又送错了！", translation: "Damn it! The delivery is wrong again!" }
    ],
    cultural_context: "TMD is the alphabetic skeleton of 他妈的 (tā mā de, literally \"his mother's\"), China's most ubiquitous mild-to-moderate curse. Writing \"TMD\" instead of the characters serves two purposes: it bypasses text filters on Chinese social media platforms (Weibo, Douyin, Bilibili all auto-filter 他妈的), and it adds a layer of plausible deniability — the letters could theoretically stand for anything. This cat-and-mouse game between profanity and censorship is a defining feature of Chinese internet culture, and TMD is one of its oldest and most successful products. The abbreviation has been in use since the early days of Chinese internet forums in the late 1990s and remains current today.\n\nThe underlying phrase 他妈的 was already considered China's \"national swear word\" long before the internet. Lu Xun, China's most celebrated modern author, wrote a 1925 essay titled \"论'他妈的'\" (On \"Ta Ma De\") in which he analyzed the phrase as a reflection of Chinese society's obsession with lineage and family honor. He argued that insulting someone's mother was the most efficient way to attack their social standing in a Confucian culture. A century later, the phrase (and its abbreviation) still functions exactly as Lu Xun described — it's less about the literal meaning and more about expressing frustration by invoking the one thing everyone cares about: family.\n\nTMD exists in a broader ecosystem of Chinese internet abbreviations for profanity: \"WC\" for 我操 (wǒ cāo, I fuck), \"NB\" for 牛逼 (niú bī, literally cow-cunt, meaning awesome/badass), \"SB\" for 傻逼 (shǎ bī, stupid cunt), and \"CNM\" for 操你妈 (cào nǐ mā, fuck your mother). Together, these form an entire parallel alphabet of censorship-evading profanity that every Chinese internet user understands instinctively. The system is so established that typing these abbreviations is now the default — many young Chinese users have written \"TMD\" so many times that it feels like its own word rather than an abbreviation, the same way English speakers use \"WTF\" without mentally expanding it to its component words.",
    regional_variations: []
  },
  {
    id: "aeff31a2-b862-49a6-98e5-b4331f9dd408", // 馬鹿 (baka) - Japanese
    example_sentences: [
      { original: "バカ！なんでそんなことしたの？", translation: "Idiot! Why did you do that?" },
      { original: "バカだなぁ、お前。でも好きだよ。", translation: "You're such a fool. But I like you." },
      { original: "バカみたいに走ってたら転んだ。", translation: "I was running like an idiot and fell down." },
      { original: "このバカ高い寿司、本当に美味しいの？", translation: "Is this stupidly expensive sushi actually good?" },
      { original: "えっ、マジで？バカじゃないの！", translation: "Wait, seriously? Are you out of your mind?!" }
    ],
    cultural_context: "Baka is almost certainly the first Japanese word most non-Japanese people learn after basic greetings — anime and manga have exported it so thoroughly that it functions as a global cultural reference point. But the word's actual behavior in Japanese is far more nuanced than its constant subtitle translation of \"idiot\" suggests. Between romantic partners, \"baka\" said softly with a slight head turn is essentially \"you're silly and I love you\" — the classic tsundere (cold-outside, warm-inside) delivery that anime has turned into an entire character archetype. Between strangers, the same word said sharply is genuinely offensive. Between a mother and child, it's scolding. Between drunk salarymen, it's bonding. The word is a perfect demonstration of how Japanese communication depends more on tone, context, and relationship than on dictionary definition.\n\nThe most famous thing about baka is the Kanto-Kansai divide. In Tokyo and eastern Japan, baka is the standard casual insult — relatively mild, used freely among friends. In Osaka and western Japan, baka is considered significantly more offensive, and the local equivalent \"aho\" (アホ) fills the casual-insult role instead. An Osaka person hearing \"baka\" reacts roughly how a Tokyo person would react to being called \"kuso yaro\" (shithead) — with genuine surprise and offense. The reverse is also true: a Tokyo person hearing \"aho\" takes it harder than an Osaka person would. This regional asymmetry has been the subject of countless Japanese TV comedy segments and is a genuine source of culture-shock for Japanese people relocating between the two regions.\n\nThe kanji 馬鹿 literally means \"horse-deer\" (馬 = horse, 鹿 = deer), and the origin story is one of the most frequently cited etymology tales in Japanese. It traces to the Chinese historical text \"Records of the Grand Historian\" (史記): the Qin Dynasty official Zhao Gao brought a deer to court and called it a horse. Those who agreed it was a horse proved their loyalty; those who correctly called it a deer were marked as disloyal and later executed. The \"fool\" who can't tell a horse from a deer became the metaphor behind the word. Whether this etymology is historically accurate is debated, but it's taught in Japanese schools and is one of those cultural factoids that every Japanese person knows — bringing it up at a dinner party marks you as educated rather than pedantic.",
    regional_variations: [
      { region: "Kanto (Tokyo/Eastern Japan)", severity: 2, note: "Standard mild insult. Used freely among friends, between couples, and as a reaction. Comparable to 'idiot' or 'dummy' in English." },
      { region: "Kansai (Osaka/Western Japan)", severity: 4, note: "Significantly more offensive here. Osaka natives find it harsh and confrontational. 'Aho' is the local casual equivalent." },
      { region: "International (anime culture)", severity: 1, note: "Essentially a loanword in global internet culture. Non-Japanese speakers use it playfully with no real offensive intent." }
    ]
  },
  {
    id: "691371b1-43f5-4933-a7d6-d38892782bcf", // ебало (yebalo) - Russian
    example_sentences: [
      { original: "Закрой ебало и слушай сюда.", translation: "Shut your fucking mouth and listen up." },
      { original: "У него такое ебало было, когда начальник вошёл.", translation: "You should've seen his fucking face when the boss walked in." },
      { original: "Дай ему в ебало, чтоб не выёбывался.", translation: "Punch him in the face so he stops showing off." },
      { original: "Ебало как у бульдога, а понтов как у модели.", translation: "Face like a bulldog but acts like a model." },
      { original: "Ебало! Ты меня напугал!", translation: "Fuck! You scared me!" }
    ],
    cultural_context: "Yebalo belongs to the ебать (yebat', to fuck) family — one of the four pillars of Russian mat. What makes it linguistically fascinating is the suffix. Russian uses -ало/-яло to form instrument nouns: зеркало (zerkalo, mirror — the thing for looking), покрывало (pokryvalo, blanket — the thing for covering), мочало (mochalo, washcloth — the thing for washing). So ебало literally means \"the thing for fucking\" — applied to someone's face or mouth. This follows perfectly regular Russian morphology to reach a maximally offensive conclusion. Native speakers feel this grammatical logic even if they can't articulate it, which is part of why the word hits so hard: it's not random vulgarity, it's structurally precise degradation.\n\nIn practice, yebalo almost always means \"face\" or \"mouth\" in an aggressively dehumanizing way. \"Закрой ебало\" (shut your yebalo) is the mat version of \"заткнись\" (shut up), escalated to the point where you're telling someone their face is a sex organ that should be closed. \"Дать в ебало\" (to give one in the yebalo) means to punch someone in the face. The word reduces a person's face — the seat of identity, expression, and communication — to its crudest possible biological function. There's no affectionate register, no playful usage between friends. Even among Russian men who pepper every sentence with mat, yebalo signals either genuine contempt or deliberately theatrical aggression.\n\nThe word circulates primarily in spoken Russian and in online text — you won't find it in published literature after the Soviet era, when mat was officially suppressed in print. Soviet censorship created a curious situation where mat flourished in speech while being absent from the written record, meaning words like yebalo existed in a kind of linguistic underground for decades. Post-Soviet Russian literature (particularly authors like Vladimir Sorokin and Viktor Pelevin) brought mat back into print as a deliberate artistic choice, and yebalo appears in works that aim to capture authentic Russian male speech. In 2014, Russia passed a law banning mat in films, theater, and concerts (Federal Law No. 101-FZ), specifically targeting words from the four mat roots — including the ебать family that yebalo belongs to. Violations carry fines, making yebalo literally illegal to say on a Russian stage.",
    regional_variations: []
  },
  {
    id: "ba53b42d-f528-41ed-82d0-065dc98af3ba", // μούτζα (moo-tzah) - Greek
    example_sentences: [
      { original: "Να, πάρε μια μούτζα! Κερατά!", translation: "Here, take a moutza! You cuckold!" },
      { original: "Του έδωσε μούτζα μπροστά σε όλο τον κόσμο.", translation: "She gave him the moutza in front of everyone." },
      { original: "Μούτζα σε όποιον με κόβει στον δρόμο.", translation: "Moutza to anyone who cuts me off in traffic." },
      { original: "Ρε φίλε, μη μου κάνεις μούτζα, πλάκα κάνω!", translation: "Dude, don't give me the moutza, I'm kidding!" },
      { original: "Η γιαγιά μου έκανε μούτζα στην τηλεόραση όταν είδε τον πολιτικό.", translation: "My grandma gave the moutza to the TV when she saw the politician." }
    ],
    cultural_context: "The moutza is not just a word — it's a gesture, and in Greece the gesture IS the insult. You thrust your open hand toward someone's face with fingers spread wide, palm forward, sometimes with both hands for emphasis. The meaning is roughly \"here, take this\" or \"eat shit\" or \"go to hell,\" but it's the visual aggression that carries the weight. In a culture where hand gestures are central to communication (Greeks gesture constantly while talking), the moutza stands out as the one gesture that can start a fistfight. Showing someone five spread fingers — even accidentally, like waving or signaling the number five — can be misread as a moutza, which is why Greek traffic culture has developed the habit of using a closed fist with thumb pointing up for \"five\" instead of an open palm.\n\nThe gesture's origin is genuinely ancient. During the Byzantine Empire, convicted criminals were paraded through the streets of Constantinople while citizens threw ash and feces at their faces. Over time, the actual throwing was replaced by the symbolic open-palm thrust — miming the act of smearing filth on someone's face. The word μούτζα itself derives from μουτζούρα (moutzoura), meaning \"smudge\" or \"smear.\" So when a Greek grandmother gives the moutza to a politician on television, she's performing a gesture with an unbroken lineage stretching back over a thousand years to Byzantine public humiliation rituals. Few modern insults anywhere in the world can claim that kind of historical depth.\n\nThe moutza creates genuine cross-cultural problems. In most Western countries, an open palm means \"stop\" or \"five\" or \"hello.\" In Greece, it's a direct insult. American and Northern European tourists waving goodbye or hailing a taxi with an open palm have inadvertently moutza'd strangers, shopkeepers, and taxi drivers. The reverse also causes confusion: Greeks traveling abroad sometimes forget that the gesture is meaningless elsewhere, or they accidentally signal \"five\" in a restaurant using a closed fist (confusing their waiter) because open-palm-five is hardwired as offensive. Greek driving schools actually teach new drivers that flashing five fingers at another driver is the moutza, not a friendly gesture — it's integrated into road safety education.",
    regional_variations: [
      { region: "Greece (mainland)", severity: 4, note: "Universally understood and offensive. Using it toward an elder or authority figure is extremely disrespectful." },
      { region: "Cyprus", severity: 4, note: "Same gesture, same meaning. Cypriot Greek preserves the tradition identically." },
      { region: "Greek diaspora (US, Australia)", severity: 3, note: "Greek-Americans and Greek-Australians still use it within their communities but awareness is fading among younger generations who are more culturally integrated." }
    ]
  },
  {
    id: "869c0159-f631-4cc0-974d-c20597a2cea7", // блин (blin) - Russian
    example_sentences: [
      { original: "Блин, я забыл ключи дома!", translation: "Shoot, I forgot my keys at home!" },
      { original: "Ой блин, это же сегодня было?", translation: "Oh damn, that was today?" },
      { original: "Блин, ну ты и красавчик!", translation: "Damn, you're looking sharp!" },
      { original: "Блин-блин-блин, опять опаздываю.", translation: "Crap-crap-crap, I'm late again." },
      { original: "Ну блин... я не знаю, что сказать.", translation: "Well, damn... I don't know what to say." }
    ],
    cultural_context: "Blin is Russian's most beloved minced oath — a word that everyone knows is standing in for блядь (blyad', whore/fuck) but that carries none of its social consequences. It literally means \"pancake\" (specifically, the thin Russian crepe served with sour cream or caviar), and the phonetic similarity to blyad' is the entire joke. A teacher can say \"blin\" in class. A news anchor can say it on air. A grandmother can say it at dinner. The substitution is so transparent and so universally accepted that blin has essentially become its own word rather than a euphemism — younger Russians don't consciously think \"pancake\" when they say it, any more than Americans think \"sugar\" when they say \"shoot\" instead of \"shit.\"\n\nRussia has a rich tradition of minced oaths built from food and nature words. \"Ёлки-палки\" (yolki-palki, fir-trees-and-sticks) substitutes for \"ёб твою мать\" (fuck your mother). \"Фиг\" (fig, the fruit) replaces \"хуй\" (dick) in expressions like \"фиг тебе\" (a fig for you, i.e., fuck you). \"Пипец\" replaces \"пиздец\" (total clusterfuck). Blin is the most successful of all these substitutions because it's the shortest, most natural-sounding, and most versatile. It works as an exclamation (\"Блин!\"), a filler word (\"ну, блин, я не знаю\"), and an intensifier (\"блин, как красиво\"). No other Russian euphemism has this range.\n\nThe word achieved a moment of international fame in 2014 when figure skater Evgeni Plushenko withdrew from the Sochi Olympics with a back injury and was caught on camera muttering \"blin\" — the footage was captioned in English-language media as him saying \"damn\" or \"oh no,\" but Russian-speaking viewers appreciated the humor of an Olympic athlete choosing the PG-rated version at a moment of genuine anguish. The clip became a meme in Russian internet culture, with the caption \"когда хочется матернуться, но камеры\" (when you want to swear but there are cameras). Blin's cultural role is essentially that of a social safety valve — it lets Russians express the full emotional range of mat without crossing the line into mat itself.",
    regional_variations: []
  },
  {
    id: "bd657b28-199d-4d83-a8a8-6e8704c38678", // pelotudo - Spanish
    example_sentences: [
      { original: "No seas pelotudo, fijate antes de cruzar.", translation: "Don't be an idiot, look before you cross." },
      { original: "Ese pelotudo me chocó el auto y se fue.", translation: "That moron crashed into my car and took off." },
      { original: "Soy un pelotudo, dejé el horno prendido toda la noche.", translation: "I'm such an idiot, I left the oven on all night." },
      { original: "¡Pelotudo! ¿Cómo no me avisaste antes?", translation: "You dumbass! Why didn't you tell me earlier?" },
      { original: "Dale, no te hagas el pelotudo, sabés bien de qué hablo.", translation: "Come on, don't play dumb, you know exactly what I'm talking about." }
    ],
    cultural_context: "Pelotudo lives in the shadow of its more famous cousin \"boludo\" — both are quintessentially Argentine, both derive from \"pelota\" (ball, as in testicle), and both mean \"idiot.\" But the relationship between the two words tells you a lot about Argentine social dynamics. Boludo has undergone almost complete semantic bleaching among younger Porteños (Buenos Aires residents): \"che, boludo\" is literally a greeting, equivalent to \"hey, dude.\" Pelotudo has not made that journey. It retains its sting. Calling a friend \"boludo\" is affection; calling them \"pelotudo\" means you're actually annoyed. The augmentative suffix -udo (big, full of) gives pelotudo a heavier, more deliberate feel — if boludo is \"you have balls,\" pelotudo is \"you are FULL of balls,\" implying maximum stupidity.\n\nThe word is almost exclusively Argentine and Uruguayan — other Spanish-speaking countries either don't use it or barely recognize it. This makes it a strong identity marker. An Argentine abroad who drops \"pelotudo\" into conversation is immediately identified as Argentine by any Spanish speaker within earshot. In the vast catalog of Argentine Spanish, which already stands apart from other varieties through its voseo (using \"vos\" instead of \"tú\"), its Italian-influenced intonation, and its distinctive slang, pelotudo is one of the words that most strongly signals \"this person is from the Río de la Plata.\" The feminine form \"pelotuda\" is used equally — gender doesn't reduce the insult's impact.\n\nArgentine soccer culture has elevated pelotudo to near-sacred status. Chanting \"pelotudo\" at the referee is a stadium ritual — tens of thousands of fans screaming it in unison at a bad call is one of the most distinctive sounds in world football. Diego Maradona famously used it in press conferences (along with much heavier language), and his casual deployment of the word became part of his anti-establishment, man-of-the-people persona. In 2022, when Argentina won the World Cup in Qatar, viral videos showed Argentine fans calling each other \"pelotudo\" in tears of joy — a perfect demonstration of how the word oscillates between insult and term of endearment depending entirely on emotional context.",
    regional_variations: [
      { region: "Argentina", severity: 2, note: "Mildly offensive — stronger than 'boludo' but still casual among friends. Severity increases to 3-4 when said to strangers or authority figures." },
      { region: "Uruguay", severity: 2, note: "Same usage and weight as Argentina. Rioplatense Spanish shares this vocabulary completely." },
      { region: "Other Latin America", severity: 1, note: "Barely used or recognized outside the Río de la Plata region. Other countries have their own equivalents (huevón in Chile/Mexico, güevón in Venezuela)." }
    ]
  },
  {
    id: "294f8b5b-9db1-4a60-a191-20fc2b5a301f", // 鸭子 (yā zi) - Chinese
    example_sentences: [
      { original: "他以前在那条街当鸭子。", translation: "He used to work as a male escort on that street." },
      { original: "别叫我鸭子，我只是长得帅而已。", translation: "Don't call me a gigolo, I'm just good-looking." },
      { original: "那个酒吧据说有很多鸭子出没。", translation: "That bar supposedly has a lot of male prostitutes hanging around." },
      { original: "他被朋友开玩笑叫鸭子，因为女朋友太多了。", translation: "His friends jokingly call him 'duck' because he has too many girlfriends." },
      { original: "鸭子！没想到他居然做那种事。", translation: "A male escort! I never expected he'd do something like that." }
    ],
    cultural_context: "The Chinese sex industry has a barnyard taxonomy that sounds absurd until you understand its internal logic. Female sex workers are called 鸡 (jī, chicken) — the most common slang term, widely known and frequently censored online. Male sex workers are called 鸭子 (yāzi, duck). The pairing isn't random: in Chinese folk culture, chickens and ducks are complementary farmyard animals, and the slang terms likely emerged together as a matched set. The words are understood by virtually all Chinese speakers but are considered crude and inappropriate for polite conversation. Calling someone a 鸭子 directly is a serious insult that questions their sexual morality and implies they sell their body.\n\nThe word occupies an interesting position in China's rapid social evolution. Male sex work in China is less openly discussed than female sex work, partly because it challenges traditional gender expectations in a society still influenced by Confucian models of masculinity. A 鸭子 is not just a person who sells sex — the word implies a man who has abandoned the masculine role of provider and protector to become an object of consumption. This makes the insult cut differently than calling a woman a 鸡: it attacks masculinity itself. In online discourse, calling a man a 鸭子 is used to imply he's living off women's money, even when no actual sex work is involved — it's become a general-purpose attack on men perceived as kept or dependent.\n\nThe word gained mainstream visibility through Chinese cinema, particularly the 2012 film \"鸭王\" (The Gigolo), a Hong Kong production that brought the term into pop culture conversation. On Chinese social media platforms like Weibo and Douyin, 鸭子 is lightly filtered but not as aggressively censored as explicitly sexual terms — its dual meaning as an actual duck provides enough ambiguity that automated filters often miss it. Users exploit this by posting duck emojis (🦆) as coded references to male sex workers or to imply someone is being a gigolo, creating a layer of plausible deniability that has become its own form of internet humor. The duck emoji is now semi-permanently coded with this secondary meaning in Chinese internet culture.",
    regional_variations: [
      { region: "Mainland China (urban)", severity: 3, note: "Well-known slang. Offensive as a direct insult but circulates freely in gossip, jokes, and online commentary." },
      { region: "Hong Kong", severity: 3, note: "Same usage in Cantonese (鴨, aap). The Hong Kong film industry normalized the term in pop culture." },
      { region: "Taiwan", severity: 3, note: "Understood and used identically. Mandarin-speaking communities share this slang across political boundaries." }
    ]
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
