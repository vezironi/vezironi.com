"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { deleteEntityAction, reorderEntityAction, saveEntityAction } from "@/lib/admin/actions/content";
import type { Entity, SaveResult } from "@/lib/admin/content";
import { Field, type FieldConfig, type Values } from "./fields";
import { SortableList } from "./sortable-list";

type Item = Values & { id: number };

function EntityForm({
  entity,
  fields,
  item,
  onDone,
}: {
  entity: Entity;
  fields: FieldConfig[];
  item: Item | null;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(saveEntityAction.bind(null, entity), null);
  const errors = state && !state.ok ? state.errors : {};

  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  return (
    <form action={action} className="grid gap-4 rounded-lg border border-accent/40 bg-surface p-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {fields.map((f) => (
        <Field key={f.name} field={f} values={item ?? {}} errors={errors} />
      ))}
      {errors._ && <p className="text-sm text-red-500">{errors._}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-60">
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button type="button" onClick={onDone} className="rounded-md border border-line px-4 py-2 text-sm text-muted hover:text-fg">
          Vazgeç
        </button>
      </div>
    </form>
  );
}

/** List with drag-to-reorder, inline create/edit form and delete for one admin entity. */
export function EntityManager({
  entity,
  items: initial,
  fields,
  titleKey,
  subtitleKey,
  imageKey,
  addLabel,
}: {
  entity: Entity;
  items: Item[];
  fields: FieldConfig[];
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  addLabel: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [synced, setSynced] = useState(initial);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [, startTransition] = useTransition();

  // Take fresh server data after router.refresh() (optimistic reorder state is replaced).
  if (initial !== synced) {
    setSynced(initial);
    setItems(initial);
  }

  const done = () => {
    setEditing(null);
    router.refresh();
  };

  function reorder(next: Item[]) {
    setItems(next);
    startTransition(async () => {
      await reorderEntityAction(entity, next.map((i) => i.id));
      router.refresh();
    });
  }

  function remove(item: Item) {
    if (!confirm(`"${item[titleKey]}" silinsin mi? Bu işlem geri alınamaz.`)) return;
    startTransition(async () => {
      await deleteEntityAction(entity, item.id);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4 p-6">
      {editing === "new" ? (
        <EntityForm entity={entity} fields={fields} item={null} onDone={done} />
      ) : (
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex w-fit items-center gap-1.5 rounded-md border border-dashed border-line-dashed px-3 py-2 text-sm text-muted hover:border-accent hover:text-fg"
        >
          <Plus className="size-4" /> {addLabel}
        </button>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-subtle">Henüz kayıt yok.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={reorder}
          className="grid gap-2"
          render={(item) =>
            editing === item.id ? (
              <div className="flex-1">
                <EntityForm entity={entity} fields={fields} item={item} onDone={done} />
              </div>
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-line bg-surface p-2.5">
                {imageKey && (
                  <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded bg-[#111113]">
                    {item[imageKey] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={String(item[imageKey])} alt="" className="size-full object-contain" />
                    ) : null}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{String(item[titleKey] ?? "")}</p>
                  {subtitleKey && <p className="truncate text-xs text-subtle">{String(item[subtitleKey] ?? "")}</p>}
                </div>
                <button type="button" onClick={() => setEditing(item.id)} className="grid size-8 place-items-center rounded text-subtle hover:bg-grid hover:text-fg" aria-label="Düzenle" title="Düzenle">
                  <Pencil className="size-4" />
                </button>
                <button type="button" onClick={() => remove(item)} className="grid size-8 place-items-center rounded text-subtle hover:bg-red-500/10 hover:text-red-500" aria-label="Sil" title="Sil">
                  <Trash2 className="size-4" />
                </button>
              </div>
            )
          }
        />
      )}
    </div>
  );
}
