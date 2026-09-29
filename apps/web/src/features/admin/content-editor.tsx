"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  AdminContentDay,
  AdminContentDetail,
  AdminMediaRef,
  AdminOptions,
  DetailResponse,
} from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { adminFetch, adminSend } from "./admin-api";
import type { AdminResourceConfig } from "./admin-resources";
import { slugify, STATUS_LABELS } from "./admin-resources";
import { MediaPicker } from "./media-picker";
import {
  dangerButtonClass,
  Dialog,
  Feedback,
  Field,
  inputClass,
  labelClass,
  LoadingState,
  Panel,
  primaryButtonClass,
  secondaryButtonClass,
  StatusBadge,
  errorText,
} from "./admin-ui";

interface DayForm {
  key: string;
  title: string;
  content: string;
  destinationId: string;
}

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  province: string;
  landscape: string;
  travelNote: string;
  highlightsText: string;
  sourceUrl: string;
  destinationId: string;
  cover: AdminMediaRef | null;
  gallery: AdminMediaRef[];
  days: DayForm[];
}

let daySequence = 0;

function dayForm(day?: AdminContentDay): DayForm {
  daySequence += 1;
  return {
    key: `day-${daySequence}`,
    title: day?.title ?? "",
    content: day?.content ?? "",
    destinationId: day?.destinationId ?? "",
  };
}

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  province: "",
  landscape: "",
  travelNote: "",
  highlightsText: "",
  sourceUrl: "",
  destinationId: "",
  cover: null,
  gallery: [],
  days: [],
};

function formFrom(detail: AdminContentDetail): FormState {
  return {
    slug: detail.slug,
    title: detail.title,
    excerpt: detail.excerpt ?? "",
    body: detail.body ?? "",
    province: detail.province ?? "",
    landscape: detail.landscape ?? "",
    travelNote: detail.travelNote ?? "",
    highlightsText: detail.highlights.join("\n"),
    sourceUrl: detail.sourceUrl ?? "",
    destinationId: detail.destinationId ?? "",
    cover: detail.coverMedia,
    gallery: [...detail.gallery]
      .sort((a, b) => a.position - b.position)
      .map((entry) => entry.media),
    days: detail.days.map((day) => dayForm(day)),
  };
}

function parseHighlights(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function codePoints(value: string): number {
  return [...value].length;
}

function validate(form: FormState, config: AdminResourceConfig, isCreate: boolean, slugLocked: boolean): string | null {
  if (form.title.trim().length === 0) return "Tiêu đề không được để trống.";
  if (codePoints(form.title.trim()) > 160) return "Tiêu đề tối đa 160 ký tự.";
  if (!slugLocked) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug) || form.slug.length > 120) {
      return "Slug phải là chữ thường, số và dấu gạch ngang (tối đa 120 ký tự).";
    }
  }
  if (codePoints(form.excerpt.trim()) > 400) return "Mô tả ngắn tối đa 400 ký tự.";
  if (codePoints(form.body) > 20_000) return "Nội dung tối đa 20.000 ký tự.";
  if (config.key === "destinations") {
    if (codePoints(form.province.trim()) > 80) return "Tỉnh/thành tối đa 80 ký tự.";
    if (codePoints(form.landscape.trim()) > 160) return "Dấu ấn cảnh quan tối đa 160 ký tự.";
    if (codePoints(form.travelNote) > 2_000) return "Lưu ý trước chuyến đi tối đa 2.000 ký tự.";
    const highlights = parseHighlights(form.highlightsText);
    if (highlights.length > 8) return "Tối đa 8 gợi ý khám phá.";
    if (highlights.some((line) => codePoints(line) > 300)) {
      return "Mỗi gợi ý khám phá tối đa 300 ký tự.";
    }
    if (form.sourceUrl.trim().length > 0 && !/^https?:\/\/[^\s]+$/i.test(form.sourceUrl.trim())) {
      return "Nguồn tham khảo phải là URL http(s).";
    }
  }
  if (config.destination === "required" && form.destinationId.length === 0) {
    return "Trải nghiệm phải gắn với một địa danh.";
  }
  if (config.days) {
    if (form.days.length > 30) return "Hành trình tối đa 30 ngày.";
    for (const [index, day] of form.days.entries()) {
      if (day.content.trim().length === 0) return `Ngày ${index + 1}: nội dung không được để trống.`;
      if (codePoints(day.content) > 5_000) return `Ngày ${index + 1}: nội dung tối đa 5.000 ký tự.`;
      if (codePoints(day.title.trim()) > 160) return `Ngày ${index + 1}: tiêu đề tối đa 160 ký tự.`;
    }
  }
  if (isCreate && form.days.length === 0 && config.days) {
    return "Hành trình cần ít nhất một ngày trước khi xuất bản.";
  }
  return null;
}

function createPayload(form: FormState, config: AdminResourceConfig): Record<string, unknown> {
  return {
    slug: form.slug,
    title: form.title.trim(),
    excerpt: form.excerpt.trim() || null,
    body: form.body.trim() || null,
    coverMediaId: form.cover?.id ?? null,
    ...(config.key === "destinations"
      ? {
          province: form.province.trim() || null,
          landscape: form.landscape.trim() || null,
          travelNote: form.travelNote.trim() || null,
          highlights: parseHighlights(form.highlightsText),
          sourceUrl: form.sourceUrl.trim() || null,
        }
      : {}),
    ...(config.destination !== "none"
      ? {
          destinationId:
            config.destination === "required"
              ? form.destinationId
              : form.destinationId || null,
        }
      : {}),
    ...(config.days
      ? {
          days: form.days.map((day) => ({
            title: day.title.trim() || null,
            content: day.content.trim(),
            destinationId: day.destinationId || null,
          })),
        }
      : {}),
    ...(config.gallery ? { galleryMediaIds: form.gallery.map((media) => media.id) } : {}),
  };
}

function updatePayload(
  detail: AdminContentDetail,
  form: FormState,
  config: AdminResourceConfig,
): Record<string, unknown> | null {
  const payload: Record<string, unknown> = {};

  if (form.title.trim() !== detail.title) payload.title = form.title.trim();
  if (detail.status !== "PUBLISHED" && form.slug !== detail.slug) payload.slug = form.slug;
  if ((form.excerpt.trim() || null) !== detail.excerpt) payload.excerpt = form.excerpt.trim() || null;
  if ((form.body.trim() || null) !== detail.body) payload.body = form.body.trim() || null;
  if ((form.cover?.id ?? null) !== (detail.coverMedia?.id ?? null)) {
    payload.coverMediaId = form.cover?.id ?? null;
  }

  if (config.key === "destinations") {
    if ((form.province.trim() || null) !== detail.province) {
      payload.province = form.province.trim() || null;
    }
    if ((form.landscape.trim() || null) !== detail.landscape) {
      payload.landscape = form.landscape.trim() || null;
    }
    if ((form.travelNote.trim() || null) !== detail.travelNote) {
      payload.travelNote = form.travelNote.trim() || null;
    }
    const highlights = parseHighlights(form.highlightsText);
    if (JSON.stringify(highlights) !== JSON.stringify(detail.highlights)) {
      payload.highlights = highlights;
    }
    if ((form.sourceUrl.trim() || null) !== detail.sourceUrl) {
      payload.sourceUrl = form.sourceUrl.trim() || null;
    }
  }

  if (config.destination !== "none") {
    const current = detail.destinationId ?? null;
    const next = form.destinationId || null;
    if (next !== current) payload.destinationId = next;
  }

  if (config.days) {
    const current = detail.days.map((day) => ({
      title: day.title ?? "",
      content: day.content,
      destinationId: day.destinationId ?? "",
    }));
    const next = form.days.map((day) => ({
      title: day.title.trim(),
      content: day.content.trim(),
      destinationId: day.destinationId,
    }));
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      payload.days = form.days.map((day) => ({
        title: day.title.trim() || null,
        content: day.content.trim(),
        destinationId: day.destinationId || null,
      }));
    }
  }

  if (config.gallery) {
    const current = [...detail.gallery]
      .sort((a, b) => a.position - b.position)
      .map((entry) => entry.media.id);
    const next = form.gallery.map((media) => media.id);
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      payload.galleryMediaIds = next;
    }
  }

  return Object.keys(payload).length > 0 ? payload : null;
}

export function ContentEditor({
  config,
  id,
  onClose,
}: {
  config: AdminResourceConfig;
  id: string | null;
  onClose: () => void;
}) {
  const [recordId, setRecordId] = useState<string | null>(id);
  const [detail, setDetail] = useState<AdminContentDetail | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [options, setOptions] = useState<AdminOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [picker, setPicker] = useState<"cover" | "gallery" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const slugTouched = useRef(false);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const request = new AbortController();
    requestRef.current = request;

    const tasks: [Promise<DetailResponse<AdminContentDetail>> | null, Promise<DetailResponse<AdminOptions>>] = [
      recordId
        ? adminFetch<DetailResponse<AdminContentDetail>>(`content/${config.key}/${recordId}`, {
            signal: request.signal,
          })
        : null,
      adminFetch<DetailResponse<AdminOptions>>("options", { signal: request.signal }),
    ];

    Promise.all([tasks[0] ?? Promise.resolve(null), tasks[1]])
      .then(([detailResponse, optionsResponse]) => {
        if (request.signal.aborted) return;
        setOptions(optionsResponse.data);
        setError("");
        if (detailResponse) {
          setDetail(detailResponse.data);
          setForm(formFrom(detailResponse.data));
          slugTouched.current = true;
        } else {
          setDetail(null);
          setForm({ ...EMPTY_FORM, days: config.days ? [dayForm()] : [] });
          slugTouched.current = false;
        }
      })
      .catch((caught) => {
        if (!request.signal.aborted && !isAbort(caught)) {
          setError(errorText(caught, "Không tải được nội dung."));
        }
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });

    return () => request.abort();
  }, [config.key, config.days, recordId]);

  const slugLocked = detail?.status === "PUBLISHED";
  const isCreate = recordId === null;
  const dirty =
    detail === null
      ? true
      : updatePayload(detail, form, config) !== null;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function changeTitle(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: !slugTouched.current && isCreate ? slugify(value) : current.slug,
    }));
  }

  async function save(): Promise<boolean> {
    const validation = validate(form, config, isCreate, slugLocked);
    if (validation) {
      setError(validation);
      return false;
    }
    setPending(true);
    setError("");
    setNotice("");
    try {
      if (isCreate) {
        const response = await adminSend<DetailResponse<AdminContentDetail>>(
          "POST",
          `content/${config.key}`,
          createPayload(form, config),
        );
        setRecordId(response.data.id);
        setDetail(response.data);
        setForm(formFrom(response.data));
        setNotice("Đã tạo nội dung ở trạng thái Nháp.");
      } else {
        if (!detail) return false;
        const payload = updatePayload(detail, form, config);
        if (!payload) {
          setNotice("Không có thay đổi để lưu.");
          return true;
        }
        const response = await adminSend<DetailResponse<AdminContentDetail>>(
          "PATCH",
          `content/${config.key}/${recordId}`,
          payload,
        );
        setDetail(response.data);
        setForm(formFrom(response.data));
        setNotice("Đã lưu thay đổi.");
      }
      return true;
    } catch (caught) {
      if (!isAbort(caught)) setError(errorText(caught, "Không lưu được nội dung."));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function transition(action: "publish" | "archive" | "restore") {
    if (recordId === null) return;
    if (action !== "restore" && dirty) {
      setError("Có thay đổi chưa lưu. Hãy lưu trước khi đổi trạng thái.");
      return;
    }
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await adminSend<DetailResponse<AdminContentDetail>>(
        "POST",
        `content/${config.key}/${recordId}/${action}`,
      );
      setDetail(response.data);
      setForm(formFrom(response.data));
      setNotice(
        action === "publish"
          ? "Đã xuất bản. Nội dung hiện trên website công khai."
          : action === "archive"
            ? "Đã lưu trữ. Nội dung đã ẩn khỏi website."
            : "Đã khôi phục về Nháp.",
      );
    } catch (caught) {
      if (!isAbort(caught)) setError(errorText(caught, "Không đổi được trạng thái."));
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (recordId === null) return;
    setPending(true);
    setError("");
    try {
      await adminSend<void>("DELETE", `content/${config.key}/${recordId}`);
      onClose();
    } catch (caught) {
      if (!isAbort(caught)) setError(errorText(caught, "Không xóa được nội dung."));
      setConfirmDelete(false);
      setPending(false);
    }
  }

  if (loading) return <LoadingState label="Đang tải nội dung…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-forest hover:underline"
          >
            ← {config.label}
          </button>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-forest">
              {isCreate ? `Thêm ${config.singular}` : form.title.trim() || "Chưa có tiêu đề"}
            </h1>
            <StatusBadge
              status={detail?.status ?? "DRAFT"}
              label={STATUS_LABELS[detail?.status ?? "DRAFT"] ?? "Nháp"}
            />
            {config.publicPath && detail?.status === "PUBLISHED" ? (
              <Link
                href={`${config.publicPath}/${detail.slug}`}
                className="text-sm font-medium text-earth underline underline-offset-2"
                target="_blank"
                prefetch={false}
              >
                Xem trên website
              </Link>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void save()}
            disabled={pending}
            className={primaryButtonClass}
          >
            {pending ? "Đang xử lý…" : isCreate ? `Tạo ${config.singular}` : "Lưu thay đổi"}
          </button>
          {!isCreate && detail?.status === "DRAFT" ? (
            <button
              type="button"
              onClick={() => void transition("publish")}
              disabled={pending}
              className={secondaryButtonClass}
            >
              Xuất bản
            </button>
          ) : null}
          {!isCreate && detail?.status === "PUBLISHED" ? (
            <button
              type="button"
              onClick={() => void transition("archive")}
              disabled={pending}
              className={secondaryButtonClass}
            >
              Lưu trữ
            </button>
          ) : null}
          {!isCreate && detail?.status === "ARCHIVED" ? (
            <button
              type="button"
              onClick={() => void transition("restore")}
              disabled={pending}
              className={secondaryButtonClass}
            >
              Khôi phục về nháp
            </button>
          ) : null}
          {!isCreate && detail?.status !== "PUBLISHED" ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={pending}
              className={dangerButtonClass}
            >
              Xóa
            </button>
          ) : null}
        </div>
      </div>

      <Feedback error={error} success={notice} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Nội dung chính">
            <div className="space-y-4">
              <Field label="Tiêu đề" htmlFor="content-title">
                <input
                  id="content-title"
                  value={form.title}
                  onChange={(event) => changeTitle(event.target.value)}
                  maxLength={200}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Slug"
                htmlFor="content-slug"
                hint={slugLocked ? "Đổi slug cần lưu trữ về nháp trước." : "Dùng trong URL, chỉ chữ thường, số và gạch ngang."}
              >
                <input
                  id="content-slug"
                  value={form.slug}
                  onChange={(event) => {
                    slugTouched.current = true;
                    setField("slug", event.target.value);
                  }}
                  disabled={slugLocked}
                  maxLength={120}
                  className={inputClass}
                />
              </Field>
              <Field label={`Mô tả ngắn (${codePoints(form.excerpt)}/400)`} htmlFor="content-excerpt">
                <textarea
                  id="content-excerpt"
                  value={form.excerpt}
                  onChange={(event) => setField("excerpt", event.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <Field label={`Nội dung (${codePoints(form.body)}/20000)`} htmlFor="content-body">
                <textarea
                  id="content-body"
                  value={form.body}
                  onChange={(event) => setField("body", event.target.value)}
                  rows={12}
                  className={inputClass}
                />
              </Field>
              {config.key === "destinations" ? (
                <>
                  <Field
                    label="Gợi ý để khám phá (mỗi dòng một gợi ý, tối đa 8)"
                    htmlFor="content-highlights"
                  >
                    <textarea
                      id="content-highlights"
                      value={form.highlightsText}
                      onChange={(event) => setField("highlightsText", event.target.value)}
                      rows={5}
                      className={inputClass}
                    />
                  </Field>
                  <Field
                    label={`Lưu ý trước chuyến đi (${codePoints(form.travelNote)}/2000)`}
                    htmlFor="content-travel-note"
                  >
                    <textarea
                      id="content-travel-note"
                      value={form.travelNote}
                      onChange={(event) => setField("travelNote", event.target.value)}
                      rows={3}
                      className={inputClass}
                    />
                  </Field>
                </>
              ) : null}
            </div>
          </Panel>

          {config.days ? (
            <Panel
              title="Lịch trình theo ngày"
              description="Ngày được đánh số theo thứ tự."
              actions={
                <button
                  type="button"
                  onClick={() => setField("days", [...form.days, dayForm()])}
                  disabled={form.days.length >= 30}
                  className={secondaryButtonClass}
                >
                  Thêm ngày
                </button>
              }
            >
              <ol className="space-y-4">
                {form.days.map((day, index) => (
                  <li key={day.key} className="rounded-md border border-forest/15 p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-forest">Ngày {index + 1}</p>
                      <span className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (index === 0) return;
                            const days = [...form.days];
                            [days[index - 1], days[index]] = [days[index]!, days[index - 1]!];
                            setField("days", days);
                          }}
                          disabled={index === 0}
                          className="rounded px-2 py-1 text-xs font-medium text-forest hover:bg-forest/10 disabled:opacity-40"
                        >
                          Lên
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (index === form.days.length - 1) return;
                            const days = [...form.days];
                            [days[index + 1], days[index]] = [days[index]!, days[index + 1]!];
                            setField("days", days);
                          }}
                          disabled={index === form.days.length - 1}
                          className="rounded px-2 py-1 text-xs font-medium text-forest hover:bg-forest/10 disabled:opacity-40"
                        >
                          Xuống
                        </button>
                        <button
                          type="button"
                          onClick={() => setField("days", form.days.filter((entry) => entry.key !== day.key))}
                          className="rounded px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-50"
                        >
                          Xóa
                        </button>
                      </span>
                    </div>
                    <div className="space-y-3">
                      <Field label="Tiêu đề ngày" htmlFor={`day-title-${day.key}`}>
                        <input
                          id={`day-title-${day.key}`}
                          value={day.title}
                          onChange={(event) =>
                            setField(
                              "days",
                              form.days.map((entry) =>
                                entry.key === day.key ? { ...entry, title: event.target.value } : entry,
                              ),
                            )
                          }
                          className={inputClass}
                          maxLength={160}
                        />
                      </Field>
                      <Field
                        label={`Nội dung ngày (${codePoints(day.content)}/5000)`}
                        htmlFor={`day-content-${day.key}`}
                      >
                        <textarea
                          id={`day-content-${day.key}`}
                          value={day.content}
                          onChange={(event) =>
                            setField(
                              "days",
                              form.days.map((entry) =>
                                entry.key === day.key ? { ...entry, content: event.target.value } : entry,
                              ),
                            )
                          }
                          rows={3}
                          className={inputClass}
                        />
                      </Field>
                      <div>
                        <label htmlFor={`day-destination-${day.key}`} className={labelClass}>
                          Địa danh của ngày (không bắt buộc)
                        </label>
                        <select
                          id={`day-destination-${day.key}`}
                          value={day.destinationId}
                          onChange={(event) =>
                            setField(
                              "days",
                              form.days.map((entry) =>
                                entry.key === day.key ? { ...entry, destinationId: event.target.value } : entry,
                              ),
                            )
                          }
                          className={inputClass}
                        >
                          <option value="">Không gắn</option>
                          {(options?.destinations ?? []).map((destination) => (
                            <option key={destination.id} value={destination.id}>
                              {destination.title} ({STATUS_LABELS[destination.status] ?? destination.status})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
                {form.days.length === 0 ? (
                  <li className="rounded-md border border-dashed border-forest/25 px-4 py-6 text-center text-sm text-ink/60">
                    Chưa có ngày nào. Thêm ít nhất một ngày để xuất bản.
                  </li>
                ) : null}
              </ol>
            </Panel>
          ) : null}
        </div>

        <div className="space-y-6">
          {config.key === "destinations" ? (
            <Panel title="Thông tin địa danh">
              <div className="space-y-4">
                <Field label="Tỉnh / thành" htmlFor="content-province">
                  <input
                    id="content-province"
                    value={form.province}
                    onChange={(event) => setField("province", event.target.value)}
                    maxLength={80}
                    className={inputClass}
                  />
                </Field>
                <Field label="Dấu ấn cảnh quan" htmlFor="content-landscape">
                  <input
                    id="content-landscape"
                    value={form.landscape}
                    onChange={(event) => setField("landscape", event.target.value)}
                    maxLength={160}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Nguồn tham khảo (URL)"
                  htmlFor="content-source-url"
                  hint="Hiển thị ở cuối bài viết."
                >
                  <input
                    id="content-source-url"
                    type="url"
                    value={form.sourceUrl}
                    onChange={(event) => setField("sourceUrl", event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Panel>
          ) : null}
          {config.destination !== "none" ? (
            <Panel title="Địa danh">
              <label htmlFor="content-destination" className="sr-only">
                Địa danh
              </label>
              <select
                id="content-destination"
                value={form.destinationId}
                onChange={(event) => setField("destinationId", event.target.value)}
                className={inputClass}
              >
                <option value="">
                  {config.destination === "required" ? "Chọn địa danh" : "Không gắn địa danh"}
                </option>
                {(options?.destinations ?? []).map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.title} ({STATUS_LABELS[destination.status] ?? destination.status})
                  </option>
                ))}
              </select>
              {config.destination === "required" ? (
                <p className="mt-2 text-xs text-ink/55">Bắt buộc. Chỉ xuất bản được khi địa danh đã xuất bản.</p>
              ) : null}
            </Panel>
          ) : null}

          <Panel
            title="Ảnh bìa"
            actions={
              <button type="button" onClick={() => setPicker("cover")} className={secondaryButtonClass}>
                {form.cover ? "Đổi ảnh" : "Chọn ảnh"}
              </button>
            }
          >
            {form.cover ? (
              <div className="space-y-2">
                <Image
                  src={form.cover.publicUrl}
                  alt={form.cover.alt}
                  width={form.cover.width}
                  height={form.cover.height}
                  unoptimized
                  className="h-40 w-full rounded-md border border-forest/15 object-cover"
                />
                <p className="text-xs text-ink/60">{form.cover.alt}</p>
                <button
                  type="button"
                  onClick={() => setField("cover", null)}
                  className="text-xs font-medium text-red-800 hover:underline"
                >
                  Bỏ ảnh bìa
                </button>
              </div>
            ) : (
              <p className="text-sm text-ink/60">Chưa chọn ảnh bìa. Bài viết sẽ dùng nền trung tính.</p>
            )}
          </Panel>

          {config.gallery ? (
            <Panel
              title="Thư viện ảnh"
              description={`${form.gallery.length}/24 ảnh, thứ tự hiển thị theo danh sách.`}
              actions={
                <button type="button" onClick={() => setPicker("gallery")} className={secondaryButtonClass}>
                  Chọn ảnh
                </button>
              }
            >
              {form.gallery.length === 0 ? (
                <p className="text-sm text-ink/60">Chưa có ảnh trong thư viện.</p>
              ) : (
                <ul className="space-y-2">
                  {form.gallery.map((media, index) => (
                    <li key={media.id} className="flex items-center gap-3 rounded-md border border-forest/15 p-2">
                      <Image
                        src={media.publicUrl}
                        alt={media.alt}
                        width={media.width}
                        height={media.height}
                        unoptimized
                        className="h-12 w-16 rounded object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs text-ink">{media.alt}</span>
                        <span className="block text-xs text-ink/50">{index + 1}</span>
                      </span>
                      <span className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (index === 0) return;
                            const gallery = [...form.gallery];
                            [gallery[index - 1], gallery[index]] = [gallery[index]!, gallery[index - 1]!];
                            setField("gallery", gallery);
                          }}
                          disabled={index === 0}
                          className="rounded px-2 py-1 text-xs font-medium text-forest hover:bg-forest/10 disabled:opacity-40"
                        >
                          Lên
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (index === form.gallery.length - 1) return;
                            const gallery = [...form.gallery];
                            [gallery[index + 1], gallery[index]] = [gallery[index]!, gallery[index + 1]!];
                            setField("gallery", gallery);
                          }}
                          disabled={index === form.gallery.length - 1}
                          className="rounded px-2 py-1 text-xs font-medium text-forest hover:bg-forest/10 disabled:opacity-40"
                        >
                          Xuống
                        </button>
                        <button
                          type="button"
                          onClick={() => setField("gallery", form.gallery.filter((entry) => entry.id !== media.id))}
                          className="rounded px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-50"
                        >
                          Bỏ
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          ) : null}

          {!isCreate && detail ? (
            <Panel title="Thông tin">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/60">Xuất bản lúc</dt>
                  <dd className="text-right text-ink">
                    {detail.publishedAt ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(detail.publishedAt)) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/60">Cập nhật</dt>
                  <dd className="text-right text-ink">
                    {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(detail.updatedAt))}
                  </dd>
                </div>
              </dl>
            </Panel>
          ) : null}
        </div>
      </div>

      {picker === "cover" ? (
        <MediaPicker
          mode="single"
          selected={form.cover ? [form.cover] : []}
          onClose={() => setPicker(null)}
          onConfirm={(media) => {
            setField("cover", media[0] ?? null);
            setPicker(null);
          }}
        />
      ) : null}
      {picker === "gallery" ? (
        <MediaPicker
          mode="multi"
          selected={form.gallery}
          onClose={() => setPicker(null)}
          onConfirm={(media) => {
            setField("gallery", media);
            setPicker(null);
          }}
        />
      ) : null}

      <Dialog open={confirmDelete} title={`Xóa ${config.singular}?`} onClose={() => setConfirmDelete(false)}>
        <p className="text-sm text-ink/75">
          Thao tác này xóa vĩnh viễn nội dung. Nếu muốn giữ lại, hãy dùng Lưu trữ.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirmDelete(false)} className={secondaryButtonClass}>
            Hủy
          </button>
          <button type="button" onClick={() => void remove()} disabled={pending} className={dangerButtonClass}>
            Xóa vĩnh viễn
          </button>
        </div>
      </Dialog>
    </div>
  );
}
