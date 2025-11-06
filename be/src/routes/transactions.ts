import { Router } from "express";
import z from "zod";

import sample from "../../data/sample.json" with { type: "json" };
import { delay } from "../utils";

const monthYearSchema = z.object({
  month: z.coerce.number().refine((val) => val >= 1 && val <= 12, { message: "month must be between 1 and 12" }),
  year: z.coerce.number().refine((val) => val >= 1970 && val <= 2100, { message: "year must be between 1970 and 2100" }),
});

const expenseCategorySchema = z.enum([
  "교통",
  "문화/여가",
  "미분류",
  "생활",
  "쇼핑/뷰티",
  "식비",
  "의료/건강",
]);
const incomeCategorySchema = z.enum(["기타 수입", "용돈", "월급"]);
const categorySchema = z.union([expenseCategorySchema, incomeCategorySchema]);

const idSchema = z.coerce.number().int().nonnegative();

const itemSchema = z.object({
  amount: z.coerce.number(),
  category: categorySchema,
  date: z.string(),
  description: z.string(),
  payment: z.string(),
});

type Item = {
  // id는 생성한 시간 순으로 부여됩니다.
  id: z.infer<typeof idSchema>;
} & z.infer<typeof itemSchema>;

const items = sample as Item[];
let id = items.length + 1;

const router: Router = Router();

// 조회
router.get("/", async (req, res) => {
  await delay(1000);
  const query = monthYearSchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: z.prettifyError(query.error), message: "잘못된 요청입니다." });
    return;
  }
  const { month, year } = query.data;
  const filteredItems = items.filter(item => {
    const date = new Date(item.date);
    return date.getFullYear() === Number(year) && date.getMonth() + 1 === month;
  });
  res.json(filteredItems);
});

// 생성
router.post("/", async (req, res) => {
  await delay(1000);
  const body = itemSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: z.prettifyError(body.error), message: "잘못된 요청입니다." });
    return;
  }
  const newItem = { id: id++, ...body.data };
  items.push(newItem);
  res.status(201).json(newItem);
});

// 수정
router.patch("/:id", async (req, res) => {
  await delay(1000);
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    res.status(400).json({ error: z.prettifyError(id.error), message: "잘못된 요청입니다." });
    return;
  }
  const body = itemSchema.partial().safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: z.prettifyError(body.error), message: "잘못된 요청입니다." });
    return;
  }
  const index = items.findIndex(item => item.id === id.data);
  if (index === -1) {
    res.status(404).json({ message: "존재하지 않는 항목입니다." });
    return;
  }
  const item = items[index]!;
  items[index] = {
    amount: body.data.amount ?? item.amount,
    category: body.data.category ?? item.category,
    date: body.data.date ?? item.date,
    description: body.data.description ?? item.description,
    id: item.id,
    payment: body.data.payment ?? item.payment,
  };
  res.json(items[index]);
});

// 삭제
router.delete("/:id", async (req, res) => {
  await delay(1000);
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    res.status(400).json({ error: z.prettifyError(id.error), message: "잘못된 요청입니다." });
    return;
  }
  const index = items.findIndex(item => item.id === id.data);
  if (index === -1) {
    res.status(404).json({ message: "존재하지 않는 항목입니다." });
    return;
  }
  items.splice(index, 1);
  res.status(204).send();
});

export default router;
