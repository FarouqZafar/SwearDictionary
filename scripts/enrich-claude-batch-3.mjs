// One-shot enrichment batch 3: 10 words using Claude-generated data.
// Run: node --env-file=.env scripts/enrich-claude-batch-3.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const enrichments = [
  {
    id: "6dc5071d-f274-4aa6-9edb-36f2697d10b6", // la madre que te parió - Spanish
    example_sentences: [
      { original: "¡Me cago en la madre que te parió, me has rayado el coche!", translation: "Goddammit to hell, you scratched my car!" },
      { original: "La madre que te parió, tío, ¡llegas dos horas tarde!", translation: "Son of a bitch, man, you're two hours late!" },
      { original: "¡La madre que te parió, qué golazo ha metido!", translation: "Holy hell, what an absolute screamer of a goal he scored! (admiration)" },
      { original: "¡Viva la madre que te parió! Eso sí que es cocinar.", translation: "Bless the mother who bore you! Now THAT is cooking. (high praise)" },
      { original: "¡La madre que me parió! Casi me da un infarto con el susto.", translation: "Holy crap! That scare nearly gave me a heart attack." }
    ],
    cultural_context: "La madre que te parió is Spanish profanity at its most theatrical — an insult that works precisely because it never finishes the job. It names the mother who gave birth to you and then stops, trusting the listener to supply the unspoken accusation. The part left hanging is always worse than anything that could be said out loud, and that's the whole trick. In Spain it functions mostly as an explosive exclamation rather than a calculated insult: you stub your toe, someone cuts you off in traffic, your team concedes in stoppage time, and out it comes. The severity sits in the middle — unmistakably crude, but so common in peninsular Spanish that nobody mistakes it for a real threat.\n\nThe phrase lives inside Spain's uniquely blasphemous swearing tradition, the 'me cago en' (I shit on) family that Latin Americans largely don't share. The full nuclear version is 'me cago en la madre que te parió' — I shit on the mother who bore you — and from there Spaniards improvise endlessly: me cago en tu padre, me cago en la leche, me cago en todo lo que se menea. The same skeleton flips effortlessly into praise: roared as 'viva la madre que te parió' (long live the mother who bore you), it becomes a tribute. And speakers aim it at themselves — 'la madre que me parió' — as pure exasperation when everything is going wrong at once.\n\nThat double life — curse and compliment sharing one phrase — is most visible in Spanish football stadiums and bullrings, where '¡viva la madre que te parió!' erupts as the highest possible tribute the instant a player or torero does something impossible. The very words that start a bar fight can, with a shift of tone, be the kindest thing a Spaniard will ever shout at you. It's a neat encapsulation of peninsular humor: the language doesn't bother inventing separate words for love and contempt when intonation can do all the work. Cross the Atlantic and the whole construction mostly evaporates — a Mexican or Argentine would understand it but reach for 'tu madre' or 'la concha de tu madre' instead.",
    regional_variations: [
      { region: "Spain (nationwide)", severity: 3, note: "Everyday exclamation of anger OR admiration depending on tone. The full 'me cago en...' version is harsher but still not fighting words." },
      { region: "Latin America", severity: 1, note: "Understood but rarely used. The 'me cago en' frame sounds distinctly Spanish; locals prefer 'tu madre' or country-specific maternal insults." }
    ]
  },
  {
    id: "0145da8b-e2de-46d5-8135-407eca1f72e9", // 婊子 (biǎo zi) - Chinese
    example_sentences: [
      { original: "你这个婊子，竟然背着我跟他好上了！", translation: "You bitch, you got together with him behind my back!" },
      { original: "别理她，那个婊子最爱搬弄是非。", translation: "Ignore her, that bitch loves stirring up drama." },
      { original: "她那种装清纯的就是典型的绿茶婊。", translation: "That fake-innocent act of hers is a classic 'green tea bitch.'" },
      { original: "公司里那个心机婊又在老板面前告状了。", translation: "That scheming bitch at the office is tattling to the boss again." },
      { original: "婊子！你竟然把我的秘密说出去了？", translation: "You bitch! You actually told everyone my secret?" }
    ],
    cultural_context: "Biaozi is one of the oldest and most cutting things a Chinese speaker can call a woman. The character 婊 is built specifically around prostitution, so unlike vaguer insults it leaves no doubt about what's being implied: that the target is sexually for sale. It's heavily gendered and genuinely severe — directed at a girlfriend or wife it can end the relationship on the spot, and in a culture where a woman's reputation (名声) still carries real social weight, the accusation of promiscuity does lasting damage. You won't hear it tossed around casually the way milder insults get traded between friends; when someone reaches for 婊子 they usually mean to wound.\n\nWhat's kept the word vividly alive is the modern internet, where 婊 has become a wildly productive suffix. Mainland netizens coin new '-婊' compounds constantly: 绿茶婊 (green-tea bitch — a woman who performs pure, innocent helplessness while quietly manipulating men), 心机婊 (scheming bitch), 圣母婊 (sanctimonious do-gooder bitch), 朋友圈婊 (the friend who curates a fake-perfect social-media life). Each targets a specific social archetype rather than literal sex work, which has let the 婊 morpheme spread far beyond its original meaning. The full noun 婊子, and the older compound 婊子养的 (born of a whore — son of a bitch), keep their full bite, while the suffix forms read more like sharp social commentary than raw profanity.\n\n绿茶婊 (green-tea bitch) is the breakout star of this family. The term exploded across the Chinese internet around 2013, reportedly sparked by gossip surrounding a beachside event in Sanya, and within months it was one of the year's defining buzzwords — a label for the woman who looks as innocent and wholesome as a cup of green tea while being anything but. It spawned endless think-pieces, listicles, and 'how to spot one' guides, and remains in heavy rotation more than a decade later. It's living proof that an ancient insult can keep reinventing itself one viral compound at a time, the centuries-old word for a prostitute quietly mutating into a tool for dissecting modern dating and office politics.",
    regional_variations: [
      { region: "Mainland China", severity: 4, note: "Severe as a standalone. The internet '-婊' suffix forms (绿茶婊, 心机婊) are lighter, treated as social satire rather than raw profanity." },
      { region: "Taiwan", severity: 4, note: "Same word and weight, written with the traditional character. Local slang adds its own gendered variants." },
      { region: "Hong Kong (Cantonese)", severity: 4, note: "Understood and used, but Cantonese has its own gendered insults that compete with it in daily speech." }
    ]
  },
  {
    id: "36b0e35b-642d-4dd9-a576-624dcd37ed33", // mẹ mày - Vietnamese
    example_sentences: [
      { original: "Mẹ mày, ai bảo mày đụng vào đồ của tao!", translation: "Your mother — who told you to touch my stuff!" },
      { original: "Mẹ mày, thằng này lặn đâu mất tăm cả năm trời!", translation: "You bastard, you vanished off the face of the earth for a whole year!" },
      { original: "Mẹ mày, đá bóng kiểu gì mà hay thế!", translation: "Damn you, how are you this good at football?!" },
      { original: "Mẹ mày chứ, trời nóng muốn chết mà mất điện.", translation: "Goddammit, it's hot enough to die and the power's out." },
      { original: "Mẹ mày! Trúng số thật à?", translation: "Holy shit! You actually won the lottery?" }
    ],
    cultural_context: "Mẹ mày is Vietnamese profanity stripped to two words — 'mother' and a contemptuous 'you' — that together detonate without ever stating the actual insult. The work is done almost entirely by the pronoun. Vietnamese has no neutral 'you'; every conversation forces a choice that encodes the exact relationship, and 'mày' sits at the rough, intimate, disrespectful bottom of that ladder. Pair it with 'mẹ' and you've invoked someone's mother in the rudest possible register, leaving the listener to fill in the unspoken completion. Among young men, though, the same bluntness flips into camaraderie: calling a close friend 'mày' (and yourself 'tao') is a marker of intimacy, so 'mẹ mày' between buddies often lands as rough affection rather than an attack.\n\nSeverity tracks geography and pronoun. In the North, especially Hanoi, the standard, slightly more formal word for mother is 'mẹ,' which makes 'mẹ mày' feel pointed and biting; Southerners more often build their maternal curses around the casual 'má' (đụ má, đm). The full-strength Northern version spells the verb out — 'địt mẹ mày' — while 'mẹ mày' is the implied, marginally softer cousin. Online, the whole family collapses into the abbreviation 'đm,' which slips past both content filters and parents while everyone reads it at full volume.\n\nVietnamese has a deep tradition of treating cursing as performance — 'chửi' can be an art form, from the rhythmic, near-operatic public tirades of village women cursing a chicken thief ('chửi mất gà') to its place in the literary canon. The most famous example opens Nam Cao's 1941 short story 'Chí Phèo,' whose title character staggers drunkenly through the village cursing the heavens, then the village, then whoever bore him — a cascade every Vietnamese student reads in school. That literary pedigree is part of why a bare phrase like 'mẹ mày' carries so much charge: cursing the mother isn't a throwaway here, it's the oldest and most loaded move in the book, and the pronoun 'mày' is the loaded trigger that fires it.",
    regional_variations: [
      { region: "Northern Vietnam (Hanoi)", severity: 4, note: "Sharper because 'mẹ' is the standard word for mother. Also doubles as rough male-bonding filler among close friends." },
      { region: "Southern Vietnam (Saigon)", severity: 3, note: "Understood, but Southerners more often curse with 'má' (đụ má) than the more formal 'mẹ.'" },
      { region: "Online / texting", severity: 2, note: "Collapsed into 'đm'; far milder written than the full phrase spoken aloud." }
    ]
  },
  {
    id: "7a2ff39e-7e51-44f9-afdf-37d723e94d89", // アホ (aho) - Japanese
    example_sentences: [
      { original: "アホか！何回言わせるねん！", translation: "Are you stupid?! How many times do I have to tell you?!" },
      { original: "ほんまアホやなあ、お前。憎めんわ。", translation: "You're such a goofball, honestly. Can't even stay mad at you." },
      { original: "なんでやねん、アホ！", translation: "What the heck, you idiot! (the classic Kansai comedy retort)" },
      { original: "アホちゃう？そんなん信じるとか。", translation: "Are you dumb? Believing something like that." },
      { original: "アホ！危ないやろ、急に飛び出して！", translation: "Idiot! That's dangerous, jumping out into the road like that!" }
    ],
    cultural_context: "Aho is the Kansai region's answer to 'baka' — a word for fool or idiot that, in Osaka and Kyoto, is so woven into daily speech it can be downright affectionate. A grandmother calling her grandchild 'aho ya naa' means something closer to 'you silly thing' than any real insult, and friends lob it at each other constantly. But aho is famous for a quirk that trips up every Japanese learner: its severity flips depending on where you stand. In Kansai, 'aho' is the gentle word and 'baka' is the harsher one; travel to Tokyo and the polarity reverses — 'baka' becomes the everyday teasing word and 'aho' suddenly sounds genuinely cutting. The exact same syllables can be a term of endearment in Osaka and a real provocation 500 kilometers east.\n\nThis makes aho one of the clearest spoken markers of Kansai identity. It's inseparable from the region's manzai comedy tradition, where the 'tsukkomi' (straight man) smacks the 'boke' (funny man) and snaps 'nande ya nen, aho!' — the rhythmic retort that punctuates Osaka stand-up. Osakans wear their aho-saying as a badge of being warmer, blunter, and funnier than buttoned-up Tokyoites. Compounds like 'aho chau?' (are you dumb?) and 'aho rashii' (ridiculous) carry the same light Kansai flavor. The word descends from older Chinese roots and has been in Japanese for centuries, but its modern emotional color is pure Kansai.\n\nIn the early 1990s the long-running Osaka TV show 'Tantei! Knight Scoop' took a viewer's innocent question — where exactly does Japan switch from saying 'aho' to saying 'baka'? — and turned it into a years-long national mapping project. The result was a genuine dialectological treasure: a roughly concentric map showing 'aho' radiating out from the old capital region around Kyoto-Osaka, with 'baka' dominating the peripheries, published in 1993 as Matsumoto Osamu's book 'Aho-Baka Bunpukō.' It remains one of the most beloved pieces of pop linguistics in Japan — proof that a televised argument over an insult can accidentally produce real scholarship.",
    regional_variations: [
      { region: "Kansai (Osaka, Kyoto)", severity: 1, note: "Mild and often affectionate — the default teasing word. Can express genuine warmth between friends and family." },
      { region: "Kanto (Tokyo)", severity: 3, note: "Noticeably harsher than 'baka' here; sounds genuinely insulting. Tokyoites use 'baka' for light teasing instead." }
    ]
  },
  {
    id: "a66479c7-3a58-4d93-901b-c42532712087", // 死ね (shine) - Japanese
    example_sentences: [
      { original: "お前みたいな奴、二度と顔見せるな、死ね！", translation: "Someone like you — don't ever show your face again, drop dead!" },
      { original: "「また課金しすぎた…」「死ねｗ」", translation: "'I overspent on the game again…' 'Lol go die.' (close friends joking)" },
      { original: "リア充は死ね。", translation: "All you happily-coupled people can drop dead. (jokey online griping)" },
      { original: "あいつなんか死ねばいいのに。", translation: "I wish a guy like that would just drop dead." },
      { original: "クラスのLINEに『死ね』って書かれてた。", translation: "Someone wrote 'go die' in the class group chat." }
    ],
    cultural_context: "Shine — the bare imperative of 'shinu,' to die — is about as far as the Japanese language goes. In a culture that prizes indirectness and works hard to avoid open confrontation, telling someone outright to die is the nuclear option, a command that strips away every layer of social cushioning Japanese normally insists on. Said with real intent it can end friendships, trigger fights, and in school settings it's treated as serious verbal violence. Yet the same word lives a strange double life online and in anime, where 'shine' and 'shineba ii noni' (you should just die) get tossed around so casually — by characters and commenters alike — that the gap between its real-life gravity and its meme-fluent online use is enormous.\n\nThat gap shows up in how the word is written. To dodge automated filters and soften the blow, Japanese netizens often swap the kanji 死 (death) for the homophone 氏 — writing '氏ね,' which reads identically as 'shine' but literally means something like 'Mr.' It started as pure censorship evasion and became its own internet token, a wink that says 'I'm saying the forbidden thing but framing it as a joke.' Related expressions stack up around it for finer control: 'kutabare' (drop dead), 'kiero' (disappear/get lost), 'shinjimae' (just die already). Each lets a speaker reach for death imagery at a slightly different intensity.\n\nThe word sits at the painful center of Japan's long struggle with school bullying ('ijime'). 'Shine' scrawled on a desk, slipped into a shoe locker, or fired into a class LINE group chat has appeared repeatedly in news coverage and court cases tied to teen suicides, and anti-bullying campaigns specifically name it as the message that does the most damage. It's a sharp reminder that in Japanese the distance between a throwaway anime catchphrase and a genuinely destructive act can be a single context away — the same two syllables a gamer types while laughing can be the last thing a bullied kid reads before going quiet.",
    regional_variations: []
  },
  {
    id: "646603ab-cecc-4b40-8e57-757eba4c6019", // địt mẹ - Vietnamese
    example_sentences: [
      { original: "Địt mẹ mày, cút khỏi đây ngay!", translation: "Motherfucker, get out of here right now!" },
      { original: "Địt mẹ, thằng này dạo này béo thế!", translation: "Holy shit, this guy's gotten so fat lately! (between close friends)" },
      { original: "Địt mẹ cái xe, lại chết máy giữa đường.", translation: "Fucking bike, it stalled in the middle of the road again." },
      { original: "Trời thì nóng, địt mẹ, điện lại còn cắt.", translation: "It's boiling hot, goddammit, and now the power's been cut." },
      { original: "Địt mẹ! Suýt nữa thì tông phải người!", translation: "Holy fuck! I almost ran someone over!" }
    ],
    cultural_context: "Địt mẹ is the gravest curse in the Northern Vietnamese arsenal: 'địt' is the crudest verb for the sexual act and 'mẹ' is the standard word for mother, so the phrase spells out an attack on the listener's mother in the bluntest terms the language allows. In a culture shaped by Confucian filial piety, where honoring one's parents sits close to sacred, insulting someone's mother is the deepest wound available, and 'địt mẹ' said in genuine anger can provoke violence. And yet — this is the Vietnamese paradox — the very same phrase is also one of the most common discourse particles in Northern male speech, fired off as filler, emphasis, or even a greeting between close friends with no aggressive intent whatsoever.\n\nThe mẹ-versus-má split is the key regional fault line. The North (Hanoi especially) uses the standard 'mẹ,' giving 'địt mẹ' its formal, biting edge; the South builds the equivalent curse around the casual 'má' — 'đụ má.' Online, both regions collapse the phrase into the lowercase abbreviation 'đm,' which sails past content filters and reads far milder than the spoken original. Spoken aloud at full volume in the North, though, 'địt mẹ mày' — adding the contemptuous 'mày,' you — is unambiguous and dangerous, a phrase you only aim at someone you've stopped caring about offending.\n\nVietnam treats cursing as something close to a performance art, and mother-insults are its centerpiece. The tradition runs from 'chửi mất gà' — the elaborate, rhythmic public tirades a village woman would unleash over a stolen chicken, escalating through entire family trees — to the literary canon. Nam Cao's celebrated 1941 story 'Chí Phèo' opens with its drunken anti-hero cursing the sky, then the village, then the mother who bore him, a sequence every Vietnamese schoolchild studies. Against that backdrop, 'địt mẹ' isn't a careless insult; it's the most concentrated form of an art the culture has been refining for centuries — which is exactly why it can carry both venom and, among friends, a strange warmth.",
    regional_variations: [
      { region: "Northern Vietnam (Hanoi)", severity: 5, note: "Standard form using the formal 'mẹ.' Gravest insult in the language, yet also extremely common as male-bonding filler." },
      { region: "Southern Vietnam", severity: 4, note: "Southerners more often use 'đụ má' with the casual 'má'; 'địt mẹ' reads as distinctly Northern." },
      { region: "Online / texting", severity: 2, note: "Abbreviated to 'đm'; far less shocking written than spoken aloud." }
    ]
  },
  {
    id: "7b0dab6d-1db2-4259-aa4e-e4edce2f8a4b", // vl - Vietnamese
    example_sentences: [
      { original: "Concert tối qua hay vl!", translation: "Last night's concert was insanely good!" },
      { original: "Deadline dí sát đít, stress vl.", translation: "Deadline's right on my ass, stressed as hell." },
      { original: "Nó kể chuyện cười nhạt vl mà ai cũng cười.", translation: "His jokes are lame as hell but everyone laughs anyway." },
      { original: "Trời lạnh vl, mặc thêm áo vào đi.", translation: "It's freezing cold, put on another layer." },
      { original: "Giá nhà tăng vl, mua sao nổi.", translation: "House prices have shot up insanely — how is anyone supposed to buy?" }
    ],
    cultural_context: "Vl is the texted skeleton of 'vãi lồn,' a phrase whose literal sense ('overflowing pussy') is far cruder than how it actually functions. In practice 'vãi lồn' and its written shorthand 'vl' work almost entirely as an intensifier — the Vietnamese equivalent of tacking 'as hell' or 'af' onto anything. Đẹp vl (gorgeous as hell), mệt vl (dead tired), hay vl (insanely good): the structure is always [adjective] + vl. Reduced to two lowercase letters it sheds most of its shock; younger Vietnamese type it dozens of times a day in chats and comments without registering the anatomical phrase underneath, the same way English speakers say 'freaking' without picturing what it stands in for.\n\nIt anchors a whole family of 'vãi' intensifiers that speakers calibrate by crudeness. 'Vãi' alone (overflowing) is the mild, polite end; 'vãi chưởng' and 'vãi nồi' are deliberately silly euphemisms that swap in harmless words to dodge the vulgar one; 'vl' (vãi lồn) is the rude core; and 'vcl' (vãi cả lồn) cranks it up another notch. Because the abbreviations hide the offending word, they slip past both platform moderation and parents reading over a shoulder — a big part of why the lowercase forms dominate Vietnamese social media while the spoken full phrases stay genuinely vulgar.\n\nIf you wanted to date a Vietnamese internet comment to the smartphone era, you could do it just by spotting 'vl.' It became one of the defining verbal tics of Vietnamese Gen Z, splattered across Facebook, TikTok, and gaming chat to the point that older generations and newspaper language columnists periodically wring their hands about it in op-eds. Its rise tracks almost perfectly with the spread of mobile messaging: a phrase too crude to shout in front of your grandmother got laundered into two innocuous-looking letters and promptly became one of the most-typed expressions in the country — vulgarity hiding in plain sight, one keystroke from respectability.",
    regional_variations: []
  },
  {
    id: "1b46b486-1510-40db-b88a-cb915c5b41df", // unggoy - Filipino
    example_sentences: [
      { original: "Unggoy ka ba't di mo pa rin gets?", translation: "Are you a monkey, you still don't get it?" },
      { original: "Tigilan mo nga ang ka-ungguyan mo dyan.", translation: "Quit your monkeying around over there." },
      { original: "Parang mga unggoy sa zoo ang klase namin kanina.", translation: "Our class earlier was like a bunch of monkeys at the zoo." },
      { original: "Ang lakas mag-flame sa chat, pero unggoy maglaro.", translation: "Talks a huge game in chat, but plays like a monkey." },
      { original: "Unggoy! Bakit mo binitawan ang lobo ng bata?!", translation: "You monkey! Why'd you let go of the kid's balloon?!" }
    ],
    cultural_context: "Unggoy — literally 'monkey' — is the Filipino go-to for calling someone stupid, primitive, or chaotically out of control. On its own it's a fairly mild insult, roughly in the 'idiot' range, and it bends easily: 'ka-ungguyan' means monkey business or clowning around, and 'mag-unggoy-unggoyan' is to fool around. Parents use it to scold misbehaving kids, friends use it to rib each other, and gamers use it to flame a teammate who keeps throwing the match. The image does the heavy lifting — the chattering, flinging, unpredictable monkey is the picture you're painting of the person.\n\nTagalog speakers reach for it most; in the Visayas a Cebuano speaker is likelier to say 'amaw' or 'buang' for the same idea, though everyone understands 'unggoy' from Manila-made TV and movies. What sharpens the word beyond simple name-calling is its colonial baggage. During the Philippine–American War and the decades of American rule that followed, U.S. political cartoons routinely caricatured Filipinos as monkeys or savage children — a dehumanizing trope that Filipinos remain very much aware of. So while 'unggoy' between friends is light, invoking the monkey image with a racial edge can tap into a much older and uglier history.\n\nThose turn-of-the-century cartoons are a documented and bitter chapter: around 1899–1902, American newspapers and magazines frequently drew Filipinos as monkeys, half-naked children, or savages to justify the occupation, recycling the same visual language used against other colonized peoples. The memory still surfaces — Filipinos have repeatedly and loudly pushed back whenever foreign media or public figures resurrect the monkey comparison. It's a reminder that an everyday playground insult can sit on top of a centuries-deep wound, and that 'unggoy,' mild as it looks, carries more freight than its surface suggests when the history behind it is in play.",
    regional_variations: [
      { region: "Metro Manila / Tagalog", severity: 2, note: "Common, mild name-calling for stupidity or chaotic behavior. Used affectionately among friends too." },
      { region: "Visayas", severity: 2, note: "Understood from Tagalog media, but locals prefer 'amaw' or 'buang' for the same meaning." }
    ]
  },
  {
    id: "1093eeb7-7141-49c6-aa1e-63aee1c40e3c", // Hore - Norwegian
    example_sentences: [
      { original: "Hold kjeft, di hore!", translation: "Shut your mouth, you whore!" },
      { original: "Folk kalte henne hore bare fordi hun datet mye.", translation: "People called her a whore just because she dated a lot." },
      { original: "Din horeunge, hvem oppdro deg egentlig?", translation: "You bastard (lit. whore's kid), who even raised you?" },
      { original: "På 1700-tallet sto 'hore' i rettsdokumenter nesten helt nøytralt.", translation: "In the 1700s, 'hore' appeared in court documents almost completely neutrally." },
      { original: "Kalte han meg virkelig hore midt i klasserommet?", translation: "Did he really call me a whore in the middle of the classroom?" }
    ],
    cultural_context: "Hore is the blunt Norwegian word for a whore, and as an insult it's a severe, unambiguously gendered attack on a woman's sexual reputation. It's a direct Germanic cousin of English 'whore' (and Swedish/Danish 'hora/hore'), tracing back to Old Norse 'hóra,' and it has carried its sting for a very long time. There's an irony in how hard it lands in modern Norway: in one of the world's most gender-egalitarian societies, a slur whose entire premise is policing female sexuality feels especially retrograde, which makes calling a woman 'hore' socially condemned rather than shrugged off. It is not a casual or affectionate word — reaching for it signals real contempt.\n\nThe word seeds a small cluster of compounds, several of them archaic-sounding but still understood: 'horeunge' (literally a whore's child — a bastard), 'horehus' (a brothel), 'horebukk' (a lecher or womanizer). Older Norwegian and broader Scandinavian Bible translations reached for related forms for the Whore of Babylon, and the word turns up in court and church records going back centuries, sometimes as a flat legal descriptor rather than pure abuse. Its modern life, though, is squarely as a slur — the legal-neutral sense is long gone, leaving only the wound.\n\nNorwegian researchers and educators have repeatedly flagged 'hore' as one of the two dominant insults in Norwegian youth culture — thrown at girls the way 'homo' is thrown at boys — and it's become a specific target of school anti-bullying work and 'mind your language' campaigns. The pairing is telling: even among teenagers in a country famous for gender equality, the default insults still split neatly along old lines, calling girls sexually loose and boys gay. That a single short word remains the go-to weapon against teenage girls in 21st-century Norway says a lot about how stubbornly these scripts persist beneath a progressive surface.",
    regional_variations: []
  },
  {
    id: "be8ee27a-a77a-42ab-b4ba-e935fdd02bc7", // อีหอย (ee hoi) - Thai
    example_sentences: [
      { original: "อีหอย! กล้าดียังไงมาโกหกกู!", translation: "You clam-cunt! How dare you lie to me!" },
      { original: "อีหอยเอ๊ย คิดถึงมึงจะแย่แล้ว!", translation: "You old bitch, I've missed you so much! (rough banter between close friends)" },
      { original: "อีหอยนั่นแหละตัวดี ปากหวานแต่ใจร้าย.", translation: "That bitch is the worst of them — sweet mouth, cruel heart." },
      { original: "เล่นตัวอีหอยอะไรนักหนา รีบมาเหอะ!", translation: "Why are you being such a stuck-up bitch — just hurry up and come!" },
      { original: "อีหอย! รถเกือบชนแล้วมั้ยล่ะ!", translation: "Holy crap! The car nearly hit us, didn't it!" }
    ],
    cultural_context: "Ee-hoi is Thai for, roughly, 'you clam-cunt' — a gendered insult built from two pieces that each deserve explaining. 'หอย' (hoi) literally means clam or shellfish, and it's the standard seafood euphemism for the vagina, a notch less blunt than the raw word 'หี' (hee). 'อี' (ee) is the derogatory-familiar prefix Thai attaches to females. Stuck together they aim a crude anatomical insult at a woman, landing in the moderately-offensive range — cruder than a simple 'stupid' but not the absolute worst the language offers. Like a lot of Thai vulgarity, its exact charge depends heavily on who's saying it to whom.\n\nThat's because the 'อี' prefix — and its male counterpart 'ไอ้' (ai) — is one of the load-bearing pillars of Thai insults (อีดอก, อีเหี้ย, อีตัว) but the very same prefix flips to affectionate the moment you attach it to a close friend's nickname. Two women who've been best friends for twenty years might greet each other as 'อีหอย' with total warmth, while the identical word hurled at a stranger is a clear provocation. The clam-as-vagina metaphor also plugs into a broader Thai habit of routing sexual slang through seafood and animals, so everyday market chatter about หอย (shellfish) carries a permanent low hum of double meaning that Thai speakers cheerfully exploit for jokes.\n\nThai broadcast standards bleep อี-prefixed insults and genital slang on television and radio, which has only sharpened Thais' famous appetite for inventive workarounds — and 'หอย' is a prime example of the strategy: reach for the seafood word instead of the anatomical one and you've said the unsayable while keeping deniability. The result is a profanity culture that prizes cleverness, where calling someone a 'clam' manages to be both filthier and funnier than the literal term, and where the censor's bleep has done nearly as much to shape the slang as the speakers themselves.",
    regional_variations: [
      { region: "Central Thai (Bangkok)", severity: 3, note: "Standard usage — crude and gendered, but the อี-prefix can soften into affection among close friends." },
      { region: "Northeastern (Isan)", severity: 2, note: "The อี/ไอ้ familiar prefixes are used even more freely in informal Isan speech, lowering the sting." }
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
