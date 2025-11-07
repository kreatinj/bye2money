import { Router } from "express";
import z from "zod";

import { delay } from "../utils";

const paymentSchema = z.string();
type Payment = z.infer<typeof paymentSchema>;

const payments: Payment[] = ["현금", "신용카드"];

const router: Router = Router();

// 조회
router.get("/", async (_req, res) => {
  await delay(1000);
  res.json(payments);
});

// 생성
router.post("/", async (req, res) => {
  await delay(1000);
  const payment = paymentSchema.safeParse(req.body);
  if (!payment.success) {
    res.status(400).json({ error: z.prettifyError(payment.error), message: "잘못된 요청입니다." });
    return;
  }
  if (payments.includes(payment.data)) {
    res.status(409).json({ message: "이미 존재하는 결제수단입니다." });
    return;
  }
  payments.push(payment.data);
  res.status(201).json(payment);
});

// 삭제
router.delete("/:payment", async (req, res) => {
  await delay(1000);
  const payment = paymentSchema.safeParse(req.params.payment);
  if (!payment.success) {
    res.status(400).json({ error: z.prettifyError(payment.error), message: "잘못된 요청입니다." });
    return;
  }
  const index = payments.indexOf(payment.data);
  if (index === -1) {
    res.status(404).json({ message: "존재하지 않는 결제수단입니다." });
    return;
  }
  payments.splice(index, 1);
  res.status(204).send();
});

export default router;
