import { ProfileForm } from "~/components/ContactusForm/ContactUsForm";
import { BackgroundBeams, Highlight } from "~/components/Hero";
import { TracingBeam } from "~/components/TracingBeam";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Card } from "~/components/ui/card";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start text-2xl text-black">
      <div className="relative min-h-[calc(100dvh-57px)] w-full">
        <BackgroundBeams>
          <h1 className="m-auto px-4 text-center text-7xl text-slate-900">
            {`הדרך הטובה ביותר להגיע `}
            <Highlight className="whitespace-nowrap">מוכן לראיון</Highlight>
          </h1>
        </BackgroundBeams>
      </div>
      <div className="relative w-full px-4">
        <TracingBeam>
          <Card className="mb-4 p-4">
            <h2 className="px-4 text-5xl font-bold text-slate-900">
              איך זה עובד?
            </h2>
            <section>
              <ol>
                {HowDoesItWorkTexts.map((text, index) => (
                  <li key={index} className="py-2 text-xl text-slate-900">
                    {`${index + 1}. ${text}`}
                  </li>
                ))}
              </ol>
            </section>
          </Card>
          <Card className="mb-4 p-4">
            <h2 className="px-4 text-5xl font-bold text-slate-900">
              שאלות נפוצות
            </h2>
            <section className="p-4">
              <Accordion type="single" collapsible>
                {FAQ.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                      <div className="text-xl text-slate-900">
                        {Object.keys(faq)[0]}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-md font-bold text-slate-600">
                        {Object.values(faq)[0]}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </Card>
          <Card className="mb-4 p-4">
            <h2 className="px-4 text-5xl font-bold text-slate-900">צור קשר</h2>
            <section className="p-4">
              <ProfileForm />
            </section>
          </Card>
        </TracingBeam>
      </div>
    </main>
  );
}

const HowDoesItWorkTexts = [
  "נרשמים לאתר בחינם.",
  "מגדירים ביומן זמנים בהם אתם פנויים לבצע ראיונות.",
  "מוצאים פרטנר לתרגול וקובעים באופן מיידי. כל סשן הוא 90 דקות - 45 דקות בהם אתם תראיינו את הפרטנר ו-45 דקות בהם אתם תהיו המרואיינים.",
  "בעמוד התוכן שלנו תמצאו מדריכים לביצוע ראיונות - איך לענות על שאלות כמרואיין, ממה להמנע ובנוסף איך להיות בכובע המראיין ולתת פידבק.",
  "לאחר כל סשן יישלח אליכם סקר בו תתבקשו לתת ציון למראיין שלכם. הציון חשוף לשאר המשתמשים וייעזור להם להחליט עם מי להתראיין.",
];

const FAQ: Record<string, string>[] = [
  {
    "למה לתרגל ראיונות?":
      "המון מחקרים הראו שתרגול זו הדרך להעלות את הבטחון. אתם תדעו מה מחכה לכם בראיון ולא תופתעו כשתגיעו אליו.",
  },
  {
    "האם זה בחינם?": "האתר בתקופת הרצה ועד להודעה חדשה השימוש בו בחינם",
  },
  {
    "כמה ראיונות מספיקים כדי להגיע מוכן?":
      "המוכנות היא ענין פרסונלי. יש אנשים ש-5 ראיונות יספיקו להם ויש כאלו שיצטרכו 30 ואולי יותר.הדבר החשוב ביותר הוא לקחת את הפידבק שניתן בראיון ולהפיק לקחים לראיון הבא. זו הדרך המהירה ביותר ללמוד ולהשתפר.",
  },
  {
    "איך אפשר לדעת שהמראיין שלי יהיה טוב?":
      "ניתן לדרג את המראיין בסולם של 1-5 כוכבים. ממוצע הדירוגים של המראיין יופיעו בפרופיל שלו ותוכלו לבחון את זה לפני קביעת ראיון התרגול.",
  },
  {
    "איך מתבצע הראיון עצמו?": `
כל סשן הוא 90 דקות כך שכל צד מראיין את השני כ-45 דקות. המטרה היא לדמות ככל שניתן ראיון אמיתי ולכן סדר הראיון הוא כך:
5 דקות של היכרות "ספר לי על עצמך", 35 דקות של ביצוע הראיון המקצועי ובסוף 5 דקות של נתינת פידבק. לפרטים נוספים גשו לעמוד התוכן של האתר`,
  },
  {
    "איך אדע מה לשאול כמראיין?": `ניתן להשתמש במאגר השאלות החינמי. במאגר תמצאו שאלות שנשאלו בראיונות עבודה אמיתיים בחברות בתעשייה.`,
  },
  {
    "אני רק מתחיל, אין לי נסיון בכלל בזה - האם זה בשבילי?":
      "הדרך הטובה ביותר להתחיל היא לקפוץ למים ולתרגל. האתר מתאים לחסרי נסיון כמו לבעלי נסיון רב שלא התראיינו המון שנים.",
  },
];
