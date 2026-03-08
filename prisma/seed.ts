import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create genres
  const genres = await Promise.all([
    prisma.genre.upsert({
      where: { slug: "fantasy" },
      update: {},
      create: { name: "Fantasy", slug: "fantasy" },
    }),
    prisma.genre.upsert({
      where: { slug: "horror" },
      update: {},
      create: { name: "Horror", slug: "horror" },
    }),
    prisma.genre.upsert({
      where: { slug: "humor" },
      update: {},
      create: { name: "Humor", slug: "humor" },
    }),
  ]);

  const [fantasy, horror, humor] = genres;

  // Story 1: Fantasy
  const story1 = await prisma.story.upsert({
    where: { slug: "the-last-lantern" },
    update: {},
    create: {
      title: "The Last Lantern",
      slug: "the-last-lantern",
      blurb:
        "At the edge of the known world, a lantern keeper tends the light that holds back the dark. When the flame begins to dim, he must decide whether the world beyond deserves saving.",
      content: `<p>The lantern had burned for nine hundred years before Edric inherited it.</p>

<p>His grandfather had tended it before him, and his grandfather's grandfather before that — an unbroken chain of men who smelled of oil and stayed up through every storm, watching a flame the size of a fist hold back something vast and patient in the dark.</p>

<p>"You'll know when it needs you," his grandfather told him on the last night, eyes already going glass. "The light talks, if you listen."</p>

<p>Edric had always assumed this was the old man going poetic. Then the flame said his name.</p>

<p>It wasn't a sound exactly. More like a thought that arrived from outside — a pressing at the edge of his mind, the way cold comes through a window you forgot to close. <em>Edric.</em> And then, quieter: <em>I am tired.</em></p>

<p>He pressed his forehead to the warm glass of the lantern housing and felt nine centuries of burning in his teeth.</p>

<p>"Just a little longer," he said.</p>

<p>The flame didn't answer. But it didn't go out, either.</p>

<p>That was the night he stopped sleeping. He learned to doze in the chair by the lantern, one hand always resting on the brass fixture, ready. The fishermen in the village below thought he had gone strange — "keeper's fever," they called it, what happened when a man spent too long alone on the cliffs. They weren't wrong, exactly.</p>

<p>What they didn't know, what no one in the village knew, was what lived in the water just beyond the light's reach.</p>

<p>Edric had seen their shadows once, when a storm knocked out the lantern for forty seconds. Forty seconds. He had never told anyone what moved in those shadows, what shapes crowded toward the shore. Some knowledge wasn't meant to travel.</p>

<p>On a Tuesday in November, the flame spoke again.</p>

<p><em>I cannot hold much longer, keeper.</em></p>

<p>"What do you need?"</p>

<p><em>Someone who believes I am worth holding.</em></p>

<p>Edric looked out at the village. At the fishing boats. At the lights in the windows of families who had never once looked up at the cliffs and wondered why the dark stopped where it did.</p>

<p>He walked down the hill for the first time in three years.</p>

<p>He knocked on doors. He told the truth. Some laughed. Some closed the door. A few — a woman named Serafine, two brothers who ran the dry goods store, a girl of about twelve who looked at him with eyes that already knew things were not as simple as they seemed — a few came back with him.</p>

<p>When they crowded into the lantern room and laid their hands on the housing alongside his, the flame flared gold and enormous, filling every corner with warmth.</p>

<p><em>Yes,</em> it said. <em>Like that.</em></p>

<p>Edric finally slept that night, for the first time in years, in a chair surrounded by people keeping a light burning against the dark.</p>

<p>He didn't hear the sea at all.</p>`,
      authorNotes:
        "I've always loved stories about small, unglamorous heroism — the person who just keeps showing up. Edric isn't a chosen one or a great warrior. He's just tired and responsible, which felt more honest to me.",
      published: true,
    },
  });

  // Story 2: Horror
  const story2 = await prisma.story.upsert({
    where: { slug: "room-14b" },
    update: {},
    create: {
      title: "Room 14B",
      slug: "room-14b",
      blurb:
        "The key card to room 212 keeps opening the wrong door. The guest in 14B has been trying to tell the staff for days. Nobody believes her — until the door opens from the other side.",
      content: `<p>The first time it happened, Claire assumed she had grabbed the wrong key.</p>

<p>She was tired. The conference had gone long, her feet hurt, and the hallways of the Alderman Hotel all looked the same — the same burgundy carpet, the same brass sconces, the same bland watercolors of local bridges. She'd found herself at room 14B instead of 212, slid the key out of habit, and the door had opened.</p>

<p>She backed out immediately. Wrong floor, she told herself. Wrong room. Easy mistake.</p>

<p>But the elevator panel showed she was on the second floor. And she had ridden it from the lobby.</p>

<p>She reported it to the front desk. The young man there, whose name tag said DEREK, smiled with great patience and explained that the keycards were programmed to individual rooms and could not open other doors. He offered to reissue her card, which she accepted.</p>

<p>The new card opened 14B again the next morning.</p>

<p>Claire stood in the hallway outside the wrong room and tried to breathe. The door had swung wide, the way doors do when a room is cold inside and the hallway is warm. She could see the corner of a bed. Floral comforter. Standard issue.</p>

<p>She could see a hand resting on the comforter.</p>

<p>The hand did not move. Claire did not move. The hallway was very quiet.</p>

<p>Then the hand reached out and slowly pulled the comforter over itself, as though whoever was in that bed had only just noticed the door was open.</p>

<p>Claire walked to the elevator. She pressed the button. She did not look back.</p>

<p>She asked Derek — a different Derek, or maybe the same one, she genuinely could not tell — to move her room. He checked his system and told her 212 was the only available room on her reservation. He offered to see if the manager—</p>

<p>"Never mind," Claire said.</p>

<p>She ate dinner in the hotel restaurant and drank one glass of wine more than she usually would. She thought about hands. She thought about how a comforter gets pulled over a body that doesn't want to be seen.</p>

<p>She went back up at ten o'clock, key card in hand.</p>

<p>Outside room 212, she hesitated. Pressed the card. The light blinked green.</p>

<p>She exhaled.</p>

<p>Pushed the door open.</p>

<p>The room was not 212. The floral comforter was pulled up to the chin of whoever was in the bed, and Claire could not see their face, and the window was dark, and the door swung shut very softly behind her.</p>

<p>From under the comforter, something said: "Finally."</p>`,
      published: true,
    },
  });

  // Story 3: Humor
  const story3 = await prisma.story.upsert({
    where: { slug: "the-interview" },
    update: {},
    create: {
      title: "The Interview",
      slug: "the-interview",
      blurb:
        "Marcus applied for a job he has no memory of applying for, at a company that does not appear to have a product. The interview is going well, which is somehow the most alarming part.",
      content: `<p>The office was on the fourteenth floor of a building Marcus had walked past a thousand times and never looked at. The lobby had a fish tank the size of a car and no fish in it. The receptionist greeted him by name before he gave it.</p>

<p>"Marcus. We've been expecting you."</p>

<p>"That's — I have an eleven o'clock?"</p>

<p>"We've been expecting you," she said again, warmly, as though this answered the question.</p>

<p>He had found the listing on a Tuesday while procrastinating. <em>Coordinator of Outcomes — competitive salary, excellent benefits, must be comfortable with ambiguity.</em> He had no memory of clicking Apply. He had, apparently, submitted a cover letter describing himself as "deeply committed to outcome coordination at every level of the outcome pipeline." He did not know what this meant.</p>

<p>He had also apparently listed as a special skill: <em>patience with fish.</em></p>

<p>The interviewer's name was Brendan. Brendan was the most normal-looking man Marcus had ever seen, which immediately made Marcus distrust him.</p>

<p>"Tell me about a time you coordinated an outcome," said Brendan.</p>

<p>"In what context?"</p>

<p>"Any context."</p>

<p>Marcus thought about the time he had parallel-parked on the first try in front of witnesses. "I once resolved a logistical challenge under mild public pressure," he said.</p>

<p>Brendan made a note. "Excellent. Where do you see yourself in five years?"</p>

<p>"Honestly I was hoping this interview would clarify what the job actually—"</p>

<p>"Leadership," said Brendan, writing. "Ambition. Good."</p>

<p>"I didn't say—"</p>

<p>"What's your greatest weakness?"</p>

<p>Marcus looked at the empty fish tank through the glass wall. "I sometimes find it difficult to move on from unanswered questions."</p>

<p>Brendan put down his pen. For the first time, he looked at Marcus directly, with something that might have been recognition, or relief, or hunger. It was hard to say.</p>

<p>"That," said Brendan, "is exactly what we're looking for."</p>

<p>"What <em>are</em> you looking for, exactly?"</p>

<p>Brendan smiled. "We'll be in touch, Marcus."</p>

<p>Marcus was in the elevator before he realized he hadn't given them his contact information. He was in the lobby before he realized the fish tank now had fish in it. He was on the street before he realized he desperately, inexplicably, hoped he got the job.</p>

<p>He got a call that afternoon.</p>

<p>"We'd like to offer you the position," said a voice that was not Brendan's. "When can you start?"</p>

<p>"Can you tell me what the job—"</p>

<p>"Monday?"</p>

<p>Marcus looked out his window. He thought about outcomes. He thought about pipelines. He thought about fish appearing in tanks while no one was watching.</p>

<p>"Monday," he said. "Sure."</p>

<p>He had, if nothing else, always been comfortable with ambiguity.</p>`,
      authorNotes:
        "This one started as a joke about corporate interview jargon and became something I can't quite categorize, which felt appropriate.",
      published: true,
    },
  });

  // Connect stories to genres
  await prisma.storyGenre.upsert({
    where: { storyId_genreId: { storyId: story1.id, genreId: fantasy.id } },
    update: {},
    create: { storyId: story1.id, genreId: fantasy.id },
  });

  await prisma.storyGenre.upsert({
    where: { storyId_genreId: { storyId: story2.id, genreId: horror.id } },
    update: {},
    create: { storyId: story2.id, genreId: horror.id },
  });

  await prisma.storyGenre.upsert({
    where: { storyId_genreId: { storyId: story3.id, genreId: humor.id } },
    update: {},
    create: { storyId: story3.id, genreId: humor.id },
  });

  console.log("✓ Created 3 genres: Fantasy, Horror, Humor");
  console.log("✓ Created 3 sample stories");
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
