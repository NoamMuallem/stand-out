"use client";
import { memo, useMemo, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type Question } from "../page";

export const QuestionsCards = ({
  questions,
}: {
  questions: Array<Question>;
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<FixedDates | "">("");

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) => {
        let filter = true;
        if (subjectFilter !== "" && question.subject !== subjectFilter) {
          filter = false;
        }
        if (companyFilter !== "" && question.company !== companyFilter) {
          filter = false;
        }
        if (
          dateFilter !== "" &&
          new Date(question.lastEditedTime).getTime() < fixedDated[dateFilter]
        ) {
          filter = false;
        }
        return filter;
      }),
    [questions, subjectFilter, companyFilter, dateFilter],
  );

  return (
    <>
      <div className="flex w-full items-center justify-start gap-2 px-4">
        <DateSelect
          dateFilter={dateFilter}
          setDateFilter={(value) => setDateFilter(value)}
        />
        <SubjectSelect
          questions={questions}
          subjectFilter={subjectFilter}
          setSubjectFilter={(value) => setSubjectFilter(value)}
        />
        <CompanySelect
          questions={questions}
          companyFilter={companyFilter}
          setCompanyFilter={(value) => setCompanyFilter(value)}
        />
      </div>
      <QuestionCards questions={filteredQuestions} />
    </>
  );
};

const QuestionCards = memo(({ questions }: { questions: Question[] }) => {
  return (
    <section className="columns-1 gap-x-4 space-y-4 p-4 sm:columns-2 md:columns-3">
      {questions.map((question) => (
        <Card
          key={question.id}
          className="flex break-inside-avoid flex-col items-center justify-start gap-2 p-4"
        >
          {question.company ? (
            <Badge variant="outline" className="ml-auto">
              {question.company}
            </Badge>
          ) : null}
          <h2>{question.question}</h2>
        </Card>
      ))}
    </section>
  );
});

QuestionCards.displayName = "QuestionCards";

const SubjectSelect = ({
  questions,
  subjectFilter,
  setSubjectFilter,
}: {
  questions: Question[];
  subjectFilter: string;
  setSubjectFilter: (value: string) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const allSubjects = useMemo(
    () =>
      [
        ...new Set(
          questions
            .filter((question) => question.subject)
            .map((question) => question.subject)
            .flat(),
        ),
      ] as string[],
    [questions],
  );

  return allSubjects.length > 0 ? (
    <Select
      value={subjectFilter}
      onValueChange={(value) => setSubjectFilter(value)}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className="w-[100px] flex-row-reverse">
        <SelectValue placeholder="נושא" />
      </SelectTrigger>
      <SelectContent>
        {allSubjects.map((subject) => (
          <SelectItem key={subject} value={subject}>
            {subject}
          </SelectItem>
        ))}
        <SelectSeparator />
        <Button
          className="w-full px-2"
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSubjectFilter("");
            setOpen(false);
          }}
        >
          מחק
        </Button>
      </SelectContent>
    </Select>
  ) : null;
};

const CompanySelect = ({
  questions,
  companyFilter,
  setCompanyFilter,
}: {
  questions: Question[];
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const allCompanies = useMemo(
    () =>
      [
        ...new Set(
          questions
            .filter((question) => question.company)
            .map((question) => question.company)
            .flat(),
        ),
      ] as string[],
    [questions],
  );

  return allCompanies.length > 0 ? (
    <Select
      value={companyFilter}
      onValueChange={(value) => setCompanyFilter(value)}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className="w-[100px] flex-row-reverse">
        <SelectValue placeholder="חברה" />
      </SelectTrigger>
      <SelectContent>
        {allCompanies.map((company) => (
          <SelectItem key={company} value={company}>
            {company}
          </SelectItem>
        ))}
        <SelectSeparator />
        <Button
          className="w-full px-2"
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setCompanyFilter("");
            setOpen(false);
          }}
        >
          מחק
        </Button>
      </SelectContent>
    </Select>
  ) : null;
};

type FixedDates = "השבוע" | "שבוע שעבר" | "חודש שעבר" | "השנה";

const currentDate = new Date();
const fixedDated: Record<FixedDates, number> = {
  השבוע: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).getTime(),
  "שבוע שעבר": new Date(
    currentDate.getTime() - 14 * 24 * 60 * 60 * 1000,
  ).getTime(),
  "חודש שעבר": new Date(
    currentDate.getTime() - 31 * 24 * 60 * 60 * 1000,
  ).getTime(),
  השנה: new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000).getTime(),
};

const DateSelect = ({
  dateFilter,
  setDateFilter,
}: {
  dateFilter: string;
  setDateFilter: (value: FixedDates | "") => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Select
      value={dateFilter}
      onValueChange={(value) => setDateFilter(value as FixedDates)}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className="w-[120px] flex-row-reverse">
        <SelectValue placeholder="תאריך" />
      </SelectTrigger>
      <SelectContent>
        {[...Object.keys(fixedDated)].map((date) => (
          <SelectItem className="flex flex-row-reverse" key={date} value={date}>
            {date}
          </SelectItem>
        ))}
        <SelectSeparator />
        <Button
          className="w-full px-2"
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setDateFilter("");
            setOpen(false);
          }}
        >
          מחק
        </Button>
      </SelectContent>
    </Select>
  );
};
