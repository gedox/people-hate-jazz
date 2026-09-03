/* PEOPLE HATE JAZZ — editorial data
   60 artists, ordered by weight in the source playlist ("Jamies", 100 tracks).
   video.kind: mv = music video | live = live/session film | vis = visualiser | trk = track only
*/
const ARTISTS = [
{
  n:1, slug:"otis-mcdonald", name:"Otis McDonald",
  origin:"Bay Area, CA", form:"BEATMAKER", filed:["library funk","bass-forward","anonymous"],
  count:8,
  pull:"The most-heard musician you have never heard of.",
  blurb:"You have heard Otis McDonald. You just didn't know it. A large slice of YouTube's free audio library is his unbothered, bass-forward funk, which means his playing has scored more birthday montages than any session player in history. Eight cuts here — the load-bearing wall of this playlist. Anonymity as a career move.",
  tracks:["Stronger","Rushing","You Feel Me","One for Dilla","Should I Buy Bitcoin","Wanna Go","Is This Jazz?"],
  video:{id:"Vt82AWLFgg8", title:"Body, Mind & Soul (Official Video)", kind:"mv"}
},
{
  n:2, slug:"rob-araujo", name:"Rob Araujo",
  origin:"Los Angeles, CA", form:"SOLOIST", filed:["keys","voicings","short-form"],
  count:6,
  pull:"Ends tunes like he remembered somewhere he had to be.",
  blurb:"A pianist who thinks in stacked ninths and shrugs about it. Araujo's tracks are two-and-a-half minutes of voicings other players would build a whole record around, then he cuts them off mid-thought. Six appearances here and not one of them outstays its welcome. The Keyscape session is the closest thing he has to a manifesto.",
  tracks:["no, regrets","Moonrock","Friktion","Jumbled","Hazelnut","Bounce"],
  video:{id:"9ZQEr3C6zPA", title:"Keyscape Sessions", kind:"live"}
},
{
  n:3, slug:"telemakus", name:"Telemakus",
  origin:"—", form:"BEATMAKER", filed:["sample-flip","collab-heavy","radio juicy"],
  count:5,
  pull:"The rare beat-tape visual that bothers to have an idea.",
  blurb:"Sample-flip formalist with an unusually good rolodex — Karriem Riggins turns up, so does half the Radio Juicy roster. Five cuts here, each built from a different set of hands. '2054' is the rare instrumental video that isn't just a looping GIF of rain on a window.",
  tracks:["Stoplight","Sunray Junonia","City Dreams","Isolation","Hallucinations"],
  video:{id:"zBwvbHfd7IE", title:"2054, w/ Karriem Riggins & Chino Corvalán (Official Music Video)", kind:"mv"}
},
{
  n:4, slug:"jazzbois", name:"Jazzbois",
  origin:"Budapest, HU", form:"BAND", filed:["blunt shelter","live band","central europe"],
  count:5,
  pull:"A rhythm section that shares one nervous system.",
  blurb:"Budapest's answer to the London thing, and honestly a livelier one. The Roots Budapest set has 1.8 million views because they play like a rhythm section sharing one nervous system — nobody counts anybody in, it just goes. Five cuts here, all blunted, none sleepy.",
  tracks:["Admas","Blunted Again","Narctis","Departure","Point Of No Return"],
  video:{id:"EhGCsaiVm0I", title:"Roots Joint // Mellow High — Live @ Roots Budapest", kind:"live"}
},
{
  n:5, slug:"dj-harrison", name:"DJ Harrison",
  origin:"Richmond, VA", form:"BEATMAKER", filed:["stones throw","jellowstone","tape"],
  count:4,
  pull:"Stones Throw signed the right guy.",
  blurb:"Richmond's Jellowstone studio is a house, and Harrison is the reason it sounds like tape. Four tracks here, two of them Dilla tributes that dodge the usual grave-robbing by actually swinging. He also plays keys in Butcher Brown, which means a good chunk of this playlist runs through one man's basement.",
  tracks:["Let Me Know","Country Fried","Dilla's Eclair","Erykah's Gun"],
  video:{id:"6kziceP0qEg", title:"Seek God ft. Fly Anakin (Official Video)", kind:"mv"}
},
{
  n:6, slug:"reuben-james", name:"Reuben James",
  origin:"London, UK", form:"SOLOIST", filed:["keys","interludes","session"],
  count:4,
  pull:"Sixty-nine seconds, and it does more than most albums.",
  blurb:"Spends the day job behind Sam Smith and the nights making interludes shorter than a voicemail. 'Ruby Smiles' runs sixty-nine seconds and gets further than most records manage in forty minutes. Four appearances here, all of them arriving and leaving before you can settle in.",
  tracks:["Ruby Smiles","Vegan Butter — Intro","Rice & Peas — Interlude","Wings of a Butterfly"],
  video:{id:"Z76O9RlEGls", title:"Amplified Sessions (Sofar London)", kind:"live"}
},
{
  n:7, slug:"vooo", name:"Vooo",
  origin:"—", form:"BEATMAKER", filed:["minaret","no-face","rhodes"],
  count:3,
  pull:"No videos, no interviews, no face.",
  blurb:"No videos, no interviews, no face. Just short, wet, gorgeously mixed instrumentals that sound like a Rhodes played into a broken tape deck on purpose. Three here. Then go and find 'Aqua' and lose the rest of the afternoon.",
  tracks:["Plus 100","Riddle","Wax"],
  video:{id:"PNjfrL3N-rk", title:"Aqua", kind:"trk"}
},
{
  n:8, slug:"okvsho", name:"Okvsho",
  origin:"—", form:"BAND", filed:["délicieuse","horns","cinematic"],
  count:2,
  pull:"Borrows its title from La Haine and its patience from nobody.",
  blurb:"A band, not a bedroom, and it shows in the way the horns breathe. 'Jusqu'ici tout va bien' borrows its title from La Haine and its patience from nobody; the video got a full VFX breakdown, which tells you how seriously it was taken. Two here, both unhurried.",
  tracks:["Jusqu'ici tout va bien","Elyjah Slaps the Space"],
  video:{id:"2PpQaWZPQk4", title:"Jusqu'ici tout va bien", kind:"mv"}
},
{
  n:9, slug:"athletic-progression", name:"Athletic Progression",
  origin:"Aarhus, DK", form:"BAND", filed:["nordic","trio","basketball"],
  count:2,
  pull:"Named their tracks after basketball moves and play like it.",
  blurb:"Three Danes who named their tracks after basketball moves — 'AND1', '3POINTPLAY', 'White Crayon' — and play like it: quick, physical, no wasted possessions. Live they are faster and meaner than the records let on. Montreux gave them seventy-two minutes and they used all of it.",
  tracks:["EMMELEV","AND1"],
  video:{id:"gF5uMt4aA-I", title:"Benihana (Sofar Aarhus)", kind:"live"}
},
{
  n:10, slug:"raffy-bushman", name:"Raffy Bushman",
  origin:"London, UK", form:"SOLOIST", filed:["keys","gospel","proved"],
  count:2,
  pull:"Keeps promising to resolve and keeps deciding not to.",
  blurb:"London pianist with a gospel spine and a hip-hop clock. 'Abraham' is the one that travels — a tune that keeps promising to resolve and keeps deciding not to, until the not-resolving becomes the point. Two here; both reward the second listen more than the first.",
  tracks:["Look Up","Abraham"],
  video:{id:"cJ3Pm-HpG_o", title:"Abraham", kind:"trk"}
},
{
  n:11, slug:"jake-milliner", name:"Jake Milliner",
  origin:"Cologne, DE", form:"BEATMAKER", filed:["melting pot","keys","ensemble"],
  count:2,
  pull:"Makes a room feel bigger by playing less in it.",
  blurb:"Melting Pot's keys man, which in Cologne means something. 'Juno' pulls in Fr1th, Marcus Tenney and Charlie Allen and somehow stays out of everyone's way. Milliner's whole method is making a room feel bigger by playing less in it.",
  tracks:["Juno","Did It Yesterday"],
  video:{id:"sQSs_DKPYWE", title:"Jack Jones ft. Bubblerap (Official Video)", kind:"mv"}
},
{
  n:12, slug:"move-78", name:"Move 78",
  origin:"Berlin, DE", form:"BAND", filed:["village live","rap","live band"],
  count:2,
  pull:"Rap over live jazz that doesn't sound like a compromise.",
  blurb:"Named after the AlphaGo move nobody saw coming, paired permanently with rapper Aver, and considerably smarter than that setup usually goes. 'Middling' live at Badehaus is the document: rap over live jazz that doesn't sound like a compromise on either side.",
  tracks:["Middling","Hectic As..."],
  video:{id:"waliXUCJyuQ", title:"Middling (Live at Badehaus)", kind:"live"}
},
{
  n:13, slug:"matt-wilde", name:"Matt Wilde",
  origin:"UK", form:"BEATMAKER", filed:["ableton","dilla","mixing"],
  count:2,
  pull:"A title doing a lot of work. The track earns it.",
  blurb:"Made a nineteen-minute video explaining exactly how he builds this stuff in Ableton, which is either generous or a flex. 'Dilla Impresses Me' is a title doing a lot of work; the track earns it. Two here, both mixed to within an inch of their lives.",
  tracks:["Dilla Impresses Me","Inner Peace"],
  video:{id:"xByLeKVYfEU", title:"Smile Today (Official Video)", kind:"mv"}
},
{
  n:14, slug:"javier-santiago", name:"Javier Santiago",
  origin:"Minneapolis / Bay Area", form:"SOLOIST", filed:["ropeadope","keys","spiritual"],
  count:2,
  pull:"Lets the flute say the part the piano can't.",
  blurb:"A pianist who treats the ancestor question literally. 'Ancestor's Blues' brings in Wonway Posibul and Elena Pinderhughes and then lets the flute say the part the piano can't. Ropeadope's most underrated signing, and one of the few artists here with two takes on the same idea in one playlist.",
  tracks:["Ancestor's Blues","Trance — ReBirth"],
  video:{id:"SRnOGNirEOw", title:"River Song (Official Video)", kind:"mv"}
},
{
  n:15, slug:"soul-food-horns", name:"Soul Food Horns",
  origin:"—", form:"COLLECTIVE", filed:["horns","for-hire","session"],
  count:2,
  pull:"The session-musician industrial complex, but good.",
  blurb:"A horn section available for hire, essentially — they turn up on other people's records and make each one about fifteen percent better. Two appearances here, both alongside Søren Søstrom. The session-musician industrial complex, but good.",
  tracks:["Black Tea","No Chaser"],
  video:{id:"T-A3de1Lw2E", title:"Black Tea", kind:"trk"}
},
{
  n:16, slug:"brothers-of-my-uncle", name:"Brothers Of My Uncle",
  origin:"—", form:"COLLECTIVE", filed:["loose","revolving","funny"],
  count:2,
  pull:"Track titles that confirm nobody is taking notes.",
  blurb:"A revolving collective with a name that reads like a mistranslation and track titles — 'cinnamon babka', 'robbing a bank type beat' — that confirm nobody is taking notes. Loose, funny, and a great deal tighter than they let on.",
  tracks:["Pillars","Robbing A Bank"],
  video:{id:"XEM-TC8WGYQ", title:"pillars (feat. tamuz, tane)", kind:"vis"}
},
{
  n:17, slug:"glimlip", name:"Glimlip",
  origin:"Amsterdam, NL", form:"BEATMAKER", filed:["lo-fi","horns","amsterdam"],
  count:2,
  pull:"Faint praise, unless you have heard what he does with a horn section.",
  blurb:"Amsterdam's most tasteful lo-fi export, which is faint praise unless you have heard what he does with a horn section. The Søren Søstrom / Soul Food Horns trilogy is the good stuff, and both playlist cuts come from it. 'Traces' has an actual video, and it is actually good.",
  tracks:["Table Talk","The Banquet"],
  video:{id:"NGWEA2eu5yI", title:"Traces w/ Freddie Kane (Official Video)", kind:"mv"}
},
{
  n:18, slug:"gogo-penguin", name:"GoGo Penguin",
  origin:"Manchester, UK", form:"BAND", filed:["piano trio","blue note","club"],
  count:2,
  pull:"Piano trio as club music, no apologies.",
  blurb:"The Manchester trio that got signed to Blue Note for sounding like drum & bass played on acoustic instruments, and then kept getting better at it. 'Hopopono' has 4.6 million views and deserves every one. Piano trio as club music, no apologies offered.",
  tracks:["Murmuration","One Percent"],
  video:{id:"-UtAV_azaBc", title:"Hopopono (Official Video)", kind:"mv"}
},
{
  n:19, slug:"kiefer", name:"Kiefer",
  origin:"Los Angeles, CA", form:"SOLOIST", filed:["stones throw","keys","diaristic"],
  count:2,
  pull:"A diary someone left open.",
  blurb:"Kiefer Shackelford writes tunes that sound like a diary someone left open on a table. The Tiny Desk is the one to watch — you can pinpoint the moment the room understands he is not going to play anything loud. 'Golden' and 'earthly things' here, plus a guest turn on Blue Lab Beats.",
  tracks:["earthly things","Golden"],
  video:{id:"asZZrUFeM_8", title:"Tiny Desk Concert", kind:"live"}
},
{
  n:20, slug:"tall-black-guy", name:"Tall Black Guy",
  origin:"Detroit, MI", form:"BEATMAKER", filed:["detroit","soul flip","drums"],
  count:1,
  pull:"Everything after it is trying to earn that drum sound.",
  blurb:"Detroit's most reverent flipper of soul records, which in Detroit is a crowded field. 'Runnin Away' with Ozay Moore and Mayala opens this playlist and it is the right call — everything that follows is quietly trying to earn that drum sound.",
  tracks:["Runnin Away (feat. Mayala)"],
  video:{id:"5uogbEL2oV0", title:"Feel Involved in Love (feat. Mr Tanqueray)", kind:"trk"}
},
{
  n:21, slug:"butcher-brown", name:"Butcher Brown",
  origin:"Richmond, VA", form:"BAND", filed:["quintet","funk","richmond"],
  count:1,
  pull:"Two great tastes, one remix.",
  blurb:"Richmond's finest, and the reason DJ Harrison and Marcus Tenney keep appearing on other people's records. The animated 'MOVE (RIDE)' video is a small miracle of a budget well spent. Here they turn up remixed by CARRTOONS, which is two great tastes doing the obvious thing.",
  tracks:["Frontline — CARRTOONS Remix"],
  video:{id:"0p7FlHVeiYw", title:"MOVE (RIDE) ft. Jay Prince (Official Animated Video)", kind:"mv"}
},
{
  n:22, slug:"jazz-mafia", name:"Jazz Mafia",
  origin:"San Francisco, CA", form:"COLLECTIVE", filed:["brass","bars","institution"],
  count:1,
  pull:"Big band as street corner.",
  blurb:"Adam Theis has run this Bay Area brass-and-bars collective long enough to be an institution, which he would probably hate hearing. 'Snack Food' pairs Trance Thompson with Otis McDonald and sounds like a block party that got organised. Big band as street corner.",
  tracks:["Snack Food"],
  video:{id:"D7LXGp0-SLA", title:"The Captain Goes Down with the Ship (Official Video)", kind:"mv"}
},
{
  n:23, slug:"noddyodd", name:"nODDyODD",
  origin:"Bay Area, CA", form:"SOLOIST", filed:["rap","headnodic","bay area"],
  count:1,
  pull:"The remix is the version worth arguing about.",
  blurb:"Bay Area rapper working almost exclusively with Headnodic, which is the correct decision. 'Heatwave' pulls in Zion I and Jazz Mafia; the Headnodic remix that made this playlist is the version worth arguing about.",
  tracks:["Heatwave — Headnodic Remix"],
  video:{id:"7knDOHYrWe0", title:"Heatwave feat. Zion I & Jazz Mafia (Headnodic Remix)", kind:"trk"}
},
{
  n:24, slug:"daniel-hayn", name:"daniel hayn",
  origin:"—", form:"BEATMAKER", filed:["synths","word-of-mouth","transcribed"],
  count:1,
  pull:"Fifty-five thousand plays for a track with no video.",
  blurb:"'On the Fly' with Paul Grant and Jonny Tobin is one of those tracks that got passed around synth-nerd YouTube until somebody sat down and transcribed the solo. Fifty-five thousand plays for a track with no video, no press and no push. Word of mouth still works.",
  tracks:["On the Fly"],
  video:{id:"i3KhBxlB6qQ", title:"On the Fly", kind:"trk"}
},
{
  n:25, slug:"redtenbachers-funkestra", name:"Redtenbacher's Funkestra",
  origin:"London, UK", form:"BAND", filed:["jazz-funk","big band","bass-led"],
  count:1,
  pull:"The long version is better and they know it.",
  blurb:"Bassist Stefan Redtenbacher runs the tightest jazz-funk big band in London and puts most of it on YouTube for nothing. 'Squid Exit Music' with Mike Outram on guitar is the seven-inch edit; the seven-minute version is better and they know it.",
  tracks:["Squid Exit Music — 7\" radio edit"],
  video:{id:"QO9w1gdBNO8", title:"Squid Exit Music ft. Mike Outram", kind:"live"}
},
{
  n:26, slug:"gilad-hekselman", name:"Gilad Hekselman",
  origin:"New York, NY", form:"SOLOIST", filed:["guitar","harmony","trio"],
  count:1,
  pull:"The guitarist other guitarists cite.",
  blurb:"The guitarist other guitarists cite. Hekselman's touch is light enough that you can miss how hard the harmony underneath is working. 'Long Way From Home' puts him next to Eric Harland — two players who have never once oversold anything.",
  tracks:["Long Way From Home (feat. Eric Harland)"],
  video:{id:"J6z96noBO7A", title:"Samba Em Preludio (Official Music Video)", kind:"mv"}
},
{
  n:27, slug:"freddie-joachim", name:"Freddie Joachim",
  origin:"California, US", form:"BEATMAKER", filed:["mood","no-press","mpc"],
  count:1,
  pull:"Built a mood and let it do the work.",
  blurb:"California beatmaker whose 'Childhood Memories' has 3.4 million plays and no video, no press, no anything. 'Shoulder Kiss' is the cut here. Some producers build a brand; Joachim built a mood and let it do the work for fifteen years.",
  tracks:["Shoulder Kiss"],
  video:{id:"3pY8ykRu7tA", title:"Childhood Memories", kind:"trk"}
},
{
  n:28, slug:"waaju", name:"Waaju",
  origin:"London, UK", form:"BAND", filed:["percussion","west africa","church of sound"],
  count:1,
  pull:"Percussion-first jazz that never sounds like a workshop.",
  blurb:"London's West-African-facing jazz band, best experienced live at Church of Sound with Majid Bekkas guesting. 'Listening Glasses' runs six minutes and earns all of them. Percussion-first jazz that never once sounds like a workshop.",
  tracks:["Listening Glasses"],
  video:{id:"Mgc3ouFkQSU", title:"Bania feat. Majid Bekkas (Live at Church of Sound)", kind:"live"}
},
{
  n:29, slug:"blue-lab-beats", name:"Blue Lab Beats",
  origin:"London, UK", form:"BEATMAKER", filed:["duo","london","hit factory"],
  count:1,
  pull:"A hit factory for people who don't want hits.",
  blurb:"NK-OK and Mr DM have quietly become London's most reliable hit factory for people who don't want hits. 'Dat It' with Kiefer is two piano brains politely agreeing to stay out of each other's way, and it is far better than that description suggests.",
  tracks:["Dat It"],
  video:{id:"V3NYpg5JJZ4", title:"Dat It ft. Kiefer (Official Video)", kind:"mv"}
},
{
  n:30, slug:"soul-supreme", name:"Soul Supreme",
  origin:"Netherlands", form:"BEATMAKER", filed:["covers","played-not-sampled","keys"],
  count:1,
  pull:"Either brave or foolish. He makes it sound obvious.",
  blurb:"Reworking A Tribe Called Quest's 'Award Tour' is either brave or foolish; Soul Supreme makes it sound obvious. The instrumental-covers project works because he plays everything rather than sampling it — the difference between a tribute and a photocopy.",
  tracks:["Award Tour (We Gettin' Down)"],
  video:{id:"Wb_5fOPaQUs", title:"Geshem Bejuni (Official Video)", kind:"mv"}
},
{
  n:31, slug:"boiled", name:"Bo!led",
  origin:"Italy", form:"BAND", filed:["post-jazz","restraint","undiscovered"],
  count:1,
  pull:"Four minutes of restraint. Get in early.",
  blurb:"An Italian outfit with an exclamation mark in the name and a few hundred views per upload, making some of the most assured post-jazz on this list. 'Interi Ora' is four minutes of restraint from a band that could clearly show off and elects not to. Get in early.",
  tracks:["Interi Ora"],
  video:{id:"AA6seMONP3k", title:"Blue Room (Official Video)", kind:"mv"}
},
{
  n:32, slug:"anomalie", name:"Anomalie",
  origin:"Montréal, QC", form:"SOLOIST", filed:["synth stack","keys","maximal"],
  count:1,
  pull:"Layer, layer, layer, and then one bright thing on top.",
  blurb:"Nicolas Dupuis stacks synths like a Montréal winter — layer, layer, layer, and then one bright thing on top. The Nexus ICA performance of 'Velours' has 1.8 million views and functions as the entire pitch for keys-forward modern jazz in a single take.",
  tracks:["Dribble"],
  video:{id:"vdruntTGf0s", title:"Velours — Live at Nexus ICA", kind:"live"}
},
{
  n:33, slug:"edbl", name:"edbl",
  origin:"London, UK", form:"BEATMAKER", filed:["guitar","prolific","features"],
  count:1,
  pull:"Releases at an alarming rate and never sounds rushed.",
  blurb:"London guitarist-producer who releases at an alarming rate and never sounds rushed. 'Worldwide' with Kazuki Isogai and JPRK is the cut here; the Mahogany live session is the one to actually watch, because it proves the records aren't stitched together.",
  tracks:["Worldwide"],
  video:{id:"Jxuw-Eti_vk", title:"The Way Things Were (Live for Mahogany)", kind:"live"}
},
{
  n:34, slug:"nico-harris", name:"Nico Harris",
  origin:"—", form:"BEATMAKER", filed:["radio juicy","communal","credits"],
  count:1,
  pull:"Somehow doesn't collapse under the credits.",
  blurb:"'Between the Bread' assembles daniel hayn, elmo, anu, Olly Chalk and André Moreira and somehow doesn't collapse under the weight of its own credits. The Radio Juicy / Collected Compositions scene at its most genuinely communal.",
  tracks:["Between the Bread"],
  video:{id:"WkBOaaq8wU0", title:"Between the Bread", kind:"trk"}
},
{
  n:35, slug:"kokoroko", name:"Kokoroko",
  origin:"London, UK", form:"BAND", filed:["afrobeat","brownswood","octet"],
  count:1,
  pull:"A London Afrobeat octet has out-streamed most rock bands.",
  blurb:"'Abusey Junction' has 63 million views, which means a London Afrobeat octet has out-streamed most rock bands working today. 'Age Of Ascent' is the grown-up follow-through — less hypnotic, more structural. The 'Da Du Dah' video is the best-directed thing on this entire list.",
  tracks:["Age Of Ascent"],
  video:{id:"7X_5Ka6xuFo", title:"Da Du Dah (Official Video)", kind:"mv"}
},
{
  n:36, slug:"pyjaen", name:"PYJÆN",
  origin:"London, UK", form:"BAND", filed:["deepmatter","six-piece","van-tight"],
  count:1,
  pull:"Play like they have been in a van together too long.",
  blurb:"Six-piece from London who play like they have been in a van together too long, in the best possible way. 'Stay Home' brings in corto.alto and takes five minutes to say something a lesser band would have rushed. The Sofar set is where the arrangement finally clicks.",
  tracks:["Stay Home"],
  video:{id:"ETx6-OiBbSA", title:"In Search of The Sticky Side (Sofar London)", kind:"live"}
},
{
  n:37, slug:"david-mrakpor", name:"David Mrakpor",
  origin:"London, UK", form:"SOLOIST", filed:["blue lab beats","keys","long-form"],
  count:1,
  pull:"Stepping out under his own name, because he wanted the space.",
  blurb:"One half of Blue Lab Beats stepping out under his own name, which is how you know he wanted the room. 'My Life' with James Coleman runs close to eight minutes and uses them properly. The Belmont Villa session is the essential document.",
  tracks:["My Life (feat. James Coleman)"],
  video:{id:"GGMKlHbSwUY", title:"Live at Belmont Villa — Session XCIX", kind:"live"}
},
{
  n:38, slug:"greg-spero", name:"Greg Spero",
  origin:"Chicago, IL", form:"SOLOIST", filed:["spirit fingers","polyrhythm","keys"],
  count:1,
  pull:"Never met a polyrhythm he didn't want to fight.",
  blurb:"Chicago pianist, Spirit Fingers bandleader, and a man who has clearly never met a polyrhythm he didn't want to fight. The Tiny Room Sessions strip all of that down to something almost tender — 'Turquoised' is the proof he can also just sit still.",
  tracks:["Turquoised (Tiny Room Sessions)"],
  video:{id:"b3J0sS_XLAA", title:"Spirit Fingers — Tune 16", kind:"live"}
},
{
  n:39, slug:"julius-rodriguez", name:"Julius Rodriguez",
  origin:"New York, NY", form:"SOLOIST", filed:["verve","piano","drums"],
  count:1,
  pull:"Plays piano and drums well enough that you resent him slightly.",
  blurb:"Plays piano and drums well enough that you resent him slightly. Verve gave him the deal; Universal Japan gave him a BLUE GIANT anime video that has done 1.2 million views. 'Where Grace Abounds' is the tune, and the at-home live version is the better take.",
  tracks:["Where Grace Abounds"],
  video:{id:"SXpUvhnT0ao", title:"BLUE GIANT — 'MOMENTUM' music video", kind:"mv"}
},
{
  n:40, slug:"44th-move", name:"44th Move",
  origin:"London, UK", form:"BAND", filed:["black acre","alfa mist","spaven"],
  count:1,
  pull:"Two and a half minutes and it doesn't need more.",
  blurb:"Alfa Mist and Richard Spaven in a room with a Black Acre budget and no obligation to write choruses. 'Little Techno' is two and a half minutes and doesn't need any more. The self-titled record is the best thing either of them put out that year.",
  tracks:["Little Techno"],
  video:{id:"iqz1QBl5d9U", title:"Anthem (Official Visualiser)", kind:"vis"}
},
{
  n:41, slug:"elujay", name:"Elujay",
  origin:"Oakland, CA", form:"SOLOIST", filed:["soulection","rap","art direction"],
  count:1,
  pull:"What happens when a rapper actually cares about art direction.",
  blurb:"Oakland's most stylish, and the only artist here with a serpentwithfeet feature. 'PENNY (INTERLUDE)' is sixty-one seconds long and completely justified. The 'Luvaroq' video is what happens when a rapper actually cares about art direction.",
  tracks:["PENNY (INTERLUDE)"],
  video:{id:"o7cXhrAmP10", title:"Luvaroq (Official Video) ft. serpentwithfeet", kind:"mv"}
},
{
  n:42, slug:"melodiesinfonie", name:"Melodiesinfonie",
  origin:"Switzerland", form:"BEATMAKER", filed:["spiritual","boom bap","band"],
  count:1,
  pull:"A seam that shouldn't work as often as it does.",
  blurb:"Swiss producer working a spiritual-jazz-meets-boom-bap seam that shouldn't work as often as it does. 'Akindstream' is the cut here. 'Merkaba' performed live with a full band is the point at which he stops being a bedroom act entirely.",
  tracks:["Akindstream"],
  video:{id:"t6AaAyXOUmk", title:"LONER (Official Video)", kind:"mv"}
},
{
  n:43, slug:"bluestaeb", name:"Bluestaeb",
  origin:"Berlin, DE", form:"BEATMAKER", filed:["jakarta","dusty","berlin"],
  count:1,
  pull:"Berlin, dusty, unbothered.",
  blurb:"Jakarta Records' house sound, more or less: Berlin, dusty, unbothered. 'TIBBE' is two and a half minutes of exactly that. The S. Fidelity collaborations are where he lets himself be funny, which is the version worth following.",
  tracks:["TIBBE"],
  video:{id:"Gw0UmYnFsM8", title:"Fuckin' Up, w/ S. Fidelity (Official Video)", kind:"mv"}
},
{
  n:44, slug:"harrison", name:"Harrison",
  origin:"Toronto, ON", form:"BEATMAKER", filed:["last gang","synth-funk","pastel"],
  count:1,
  pull:"Nostalgic, according to people who weren't there.",
  blurb:"Toronto producer making the kind of pastel synth-funk that gets described as nostalgic by people who weren't there. 'Around You' clocks in at 1:52 and knows exactly what it is. The 'Vertigo' video with a l l i e is his best-looking work by a distance.",
  tracks:["Around You"],
  video:{id:"X2nbjeiklL4", title:"Vertigo feat. a l l i e (Official Music Video)", kind:"mv"}
},
{
  n:45, slug:"potatohead-people", name:"Potatohead People",
  origin:"Vancouver, BC", form:"BEATMAKER", filed:["bastard jazz","duo","veterans"],
  count:1,
  pull:"Doing this since before the algorithm decided it liked it.",
  blurb:"Nick Wisdom and AstroLogical have been doing this since before the algorithm decided it liked it. 'Blue Charms' is the entry point and the most-played thing they have. They also got De La Soul on a record, which settles the credibility question permanently.",
  tracks:["Blue Charms"],
  video:{id:"V41ej-X_p2g", title:"Single Life ft. Bunnie (Official Music Video)", kind:"mv"}
},
{
  n:46, slug:"s-fidelity", name:"S. Fidelity",
  origin:"Berlin, DE", form:"BEATMAKER", filed:["jakarta","swagger","features"],
  count:1,
  pull:"Swagger that his labelmates' records don't have.",
  blurb:"Berlin again, Jakarta again, but S. Fidelity's records carry a swagger his labelmates' don't. 'Tiara St' stacks four vocalists and lets them jostle for the same two bars. The Dawn Richard video is the best thing on his channel.",
  tracks:["Tiara St"],
  video:{id:"3k3rakoID60", title:"Play feat. Dawn Richard (Official Video)", kind:"mv"}
},
{
  n:47, slug:"kamaal-williams", name:"Kamaal Williams",
  origin:"London, UK", form:"SOLOIST", filed:["black focus","broken beat","club"],
  count:1,
  pull:"The reason South London jazz got a club audience.",
  blurb:"Henry Wu, Yussef Kamaal, Black Focus — whatever name he is using this year, he is the reason South London jazz ended up with a club audience instead of a concert-hall one. 'New Heights (Visions of Aisha Malik)' is the most beautiful thing he has attached his name to.",
  tracks:["New Heights (Visions of Aisha Malik)"],
  video:{id:"jR1RW_9LV1Q", title:"New Heights (Visions of Aisha Malik) (Official Video)", kind:"mv"}
},
{
  n:48, slug:"oli-howe", name:"Oli Howe",
  origin:"UK", form:"SOLOIST", filed:["deepmatter","keys","underwritten"],
  count:1,
  pull:"766,000 plays for a keys player nobody writes about.",
  blurb:"'Avocado' has 766,000 plays, which is a lot for a keys player nobody writes about. 'It's All Good' with David Mrakpor is the cut here. The Cinematic Live Sessions take on 'Too Many Kicks' is the case for the defence.",
  tracks:["It's All Good"],
  video:{id:"Nl1CRzSY0mM", title:"Too Many Kicks (Cinematic Live Sessions)", kind:"live"}
},
{
  n:49, slug:"james-francies", name:"James Francies",
  origin:"Houston, TX", form:"SOLOIST", filed:["blue note","left hand","area code"],
  count:1,
  pull:"A left hand that behaves like a separate musician.",
  blurb:"Houston's own, on Blue Note, with a left hand that behaves like a separate musician with its own opinions. '713' is his area code and his best tune, and the video is one of the very few here that treats instrumental jazz like it deserves a budget.",
  tracks:["713"],
  video:{id:"u2egpSzhjsA", title:"713 (Official Video)", kind:"mv"}
},
{
  n:50, slug:"modha", name:"Modha",
  origin:"Berlin, DE", form:"BAND", filed:["kryptox","small scene","high ceiling"],
  count:1,
  pull:"Small scene, high ceiling.",
  blurb:"Berlin band whose best-known track is named after a street in the south-east of the city. 'Harzer Straße' is the one with the views; 'Endless Thoughts' is the one here, and it is the better piece of writing. Small scene, high ceiling.",
  tracks:["Endless Thoughts"],
  video:{id:"dD0TT7309-s", title:"Harzer Straße", kind:"vis"}
},
{
  n:51, slug:"daylight-robbery", name:"Daylight Robbery!",
  origin:"—", form:"BAND", filed:["melting pot","moons","weightless"],
  count:1,
  pull:"Either a concept or a filing system.",
  blurb:"Every track is named after a moon — Ersa, Carpo, Thebe, Galilean Moons — which is either a concept or a filing system. Either way the music is weightless in exactly the right way, and 'Ersa' is the best-argued of them.",
  tracks:["Ersa"],
  video:{id:"41dEOKZfBls", title:"Ersa", kind:"trk"}
},
{
  n:52, slug:"carrtoons", name:"CARRTOONS",
  origin:"Brooklyn, NY", form:"SOLOIST", filed:["bass","brooklyn","less-is-more"],
  count:1,
  pull:"Plays like the bass is the melody and everything else is optional.",
  blurb:"Brooklyn bassist who plays like the bass is the melody instrument and everything else is optional. 'Young Buck' with DJ Harrison runs 1:56 and says everything. His Tiny Desk is a masterclass in doing less, deliberately, in front of people.",
  tracks:["Young Buck"],
  video:{id:"yskw0JMXQaM", title:"Tiny Desk Concert", kind:"live"}
},
{
  n:53, slug:"remulak", name:"Remulak",
  origin:"UK", form:"BEATMAKER", filed:["village live","music videos","flips"],
  count:1,
  pull:"An actual catalogue of music videos — a rarity down here.",
  blurb:"Village Live's most reliable beatmaker, and one of the few people at this level with an actual catalogue of music videos. 'Highlife' with Melanin 9 and Skriblah Dan Gogh is the best of them. 'Jazz Hands' is ninety-nine seconds of pure flip.",
  tracks:["Jazz Hands"],
  video:{id:"ngazz1QZBTA", title:"Highlife (Official Video) w/ Melanin 9 & Skriblah Dan Gogh", kind:"mv"}
},
{
  n:54, slug:"tom-doolie", name:"Tom Doolie",
  origin:"—", form:"BEATMAKER", filed:["efficiency","short","195k"],
  count:1,
  pull:"Efficiency as an aesthetic.",
  blurb:"'Train Tales' is ninety-eight seconds long, has 195,000 plays, and is built out of roughly four elements. Efficiency as an aesthetic. Named, one presumes, after the murder ballad, which is a lot of weight for a track this light on its feet.",
  tracks:["Train Tales"],
  video:{id:"EPWE_mU3ISI", title:"Train Tales", kind:"trk"}
},
{
  n:55, slug:"rugawd", name:"Rugawd",
  origin:"—", form:"SOLOIST", filed:["bass","short","unsigned"],
  count:1,
  pull:"Would be unbearable if the playing weren't this good.",
  blurb:"Bills himself as The Bass Prophet, which would be unbearable if the playing weren't this good. 'Almost' is under two minutes. His Tiny Desk submission didn't get picked, which reads more like NPR's problem than his.",
  tracks:["Almost"],
  video:{id:"CAQkMteCxQs", title:"Grow (Official Video)", kind:"mv"}
},
{
  n:56, slug:"k15", name:"K15",
  origin:"London, UK", form:"BEATMAKER", filed:["wild oats","murky","house tempo"],
  count:1,
  pull:"Recorded underwater, on purpose.",
  blurb:"London producer working the deep and murky end — house tempos, jazz harmony, absolutely no hurry. 'Beneath The Tomb' is 2:21 and sounds like it was recorded underwater on purpose. One of the few people here who could DJ this whole playlist properly.",
  tracks:["Beneath The Tomb"],
  video:{id:"j3jXCAOfEzI", title:"Beneath The Tomb", kind:"trk"}
},
{
  n:57, slug:"yussef-dayes", name:"Yussef Dayes",
  origin:"London, UK", form:"SOLOIST", filed:["drums","brownswood","film"],
  count:1,
  pull:"Before the Malibu videos. Still the version.",
  blurb:"The best drummer of his generation and the only artist here with a forty-six-minute film shot in Japan. 'For My Ladies' live in Copenhagen, July 2019 — before the Malibu films, before the arenas, before everyone caught up. Still the version.",
  tracks:["For My Ladies — Live in Copenhagen, July 9, 2019"],
  video:{id:"qw6MY45tK6o", title:"Black Classical Music ft. Venna & Charlie Stacey (Official Video)", kind:"mv"}
},
{
  n:58, slug:"iamnobodi", name:"IAMNOBODI",
  origin:"Germany", form:"BEATMAKER", filed:["beat tape","features","rolodex"],
  count:1,
  pull:"Nobody has done more for the phrase 'beat tape'.",
  blurb:"German producer with a rolodex — Emmavie, Zacari, Mick Jenkins have all passed through. 'Imani (Faith)' with R.O.M. is the cut here. Nobody has done more to make 'beat tape' sound like a serious format rather than a rough draft.",
  tracks:["Imani (Faith)"],
  video:{id:"4BClJNRBiuc", title:"An Idea (feat. Emmavie, Zacari, Josh J)", kind:"trk"}
},
{
  n:59, slug:"makaya-mccraven", name:"Makaya McCraven",
  origin:"Chicago, IL", form:"SOLOIST", filed:["beat scientist","blue note","cut-ups"],
  count:1,
  pull:"Records live sessions, then cuts them up like a producer would.",
  blurb:"Calls himself a beat scientist and means it: he records live sessions, then cuts them into records the way a producer would treat someone else's vinyl. 'When Your Lover Has Gone' is a standard, rebuilt from the drums up. The KEXP set is the best thirty-eight minutes on this site.",
  tracks:["When Your Lover Has Gone"],
  video:{id:"Y_BE_gi4YkA", title:"Full Performance (Live on KEXP)", kind:"live"}
},
{
  n:60, slug:"chino-corvalan", name:"Chino Corvalán",
  origin:"South America", form:"SOLOIST", filed:["guaraní soul","cuarteto","closer"],
  count:1,
  pull:"A hell of a way to end a playlist.",
  blurb:"South American bandleader who surfaces on Telemakus records and then disappears back into his own cuarteto and the Guaraní Soul sessions. 'Sadunas' with Victor Alvarez closes this playlist, which is a hell of a way to end a hundred tracks.",
  tracks:["Sadunas"],
  video:{id:"ngrLvCfUEYk", title:"Ondelou (Video Oficial)", kind:"mv"}
}
];
