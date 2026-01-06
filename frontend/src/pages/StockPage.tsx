// src/pages/StockPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SectionCard from "../components/SectionCard";
import EmptyState from "../components/EmptyState";
import { useToastStore } from "../store/toast.store";

import { useProducts } from "../features/stock/hooks/useProducts";
import { useCreateProduct } from "../features/stock/hooks/useCreateProduct";

import { useStockItemsByProject } from "../features/stock/hooks/useStockItemsByProject";
import { useMovementsByStockItem } from "../features/stock/hooks/useMovementsByStockItem";
import { useCreateStockItem } from "../features/stock/hooks/useCreateStockItem";
import { useAdjustStock } from "../features/stock/hooks/useAdjustStock";

import type { StockItem, StockMovement } from "../features/stock/api/stock.api";

import CreateProductModal from "../features/stock/components/CreateProductModal";
import CreateStockItemModal from "../features/stock/components/CreateStockItemModal";
import AdjustStockModal from "../features/stock/components/AdjustStockModal";

function productNameFromStockItem(item: StockItem) {
  const p = item.productId as any;
  return typeof p === "object" && p?.name ? p.name : String(item.productId);
}

function movementProductName(m: StockMovement) {
  const si = m.stockItemId as any;
  const p = si?.productId as any;
  if (p && typeof p === "object" && p.name) return p.name;
  return si?._id ? `Item ${si._id}` : "Item";
}

function movementUserName(m: StockMovement) {
  const u = m.userId as any;
  if (!u) return "";
  if (typeof u === "object") return u.name || u.email || "";
  return "";
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function MovementBadge({ type }: { type: "IN" | "OUT" }) {
  const cls =
    type === "IN"
      ? "bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.25)]"
      : "bg-[rgba(239,68,68,0.12)] border-[rgba(239,68,68,0.25)]";

  return (
    <span className={["chip font-extrabold border", cls].join(" ")}>
      {type}
    </span>
  );
}

export default function StockPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const pid = projectId || null;

  const pushToast = useToastStore((s) => s.push);

  // products
  const productsQ = useProducts();
  const createProduct = useCreateProduct();

  // project stock items
  const itemsQ = useStockItemsByProject(pid);
  const createItem = useCreateStockItem(pid || "");

  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  // item movements
  const movesQ = useMovementsByStockItem(activeItemId);
  const adjust = useAdjustStock(pid || "", activeItemId);

  // modals
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [createItemOpen, setCreateItemOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  // local UI
  const [search, setSearch] = useState("");

  useEffect(() => {
    // auto select first item when list loads
    if (!activeItemId && itemsQ.data?.length) {
      setActiveItemId(itemsQ.data[0]._id);
    }
  }, [activeItemId, itemsQ.data]);

  const items = itemsQ.data || [];
  const products = productsQ.data || [];

  const filteredItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => {
      const name = productNameFromStockItem(it).toLowerCase();
      const location = (it.location || "").toLowerCase();
      return name.includes(s) || location.includes(s);
    });
  }, [items, search]);

  const activeItem = useMemo(
    () => items.find((x) => x._id === activeItemId) || null,
    [items, activeItemId]
  );

  async function onCreateProduct(dto: {
    name: string;
    sku?: string;
    unit?: string;
  }) {
    await createProduct.mutateAsync(dto);
    pushToast({
      title: t("stock.toast.productCreated"),
      message: dto.name,
      kind: "success",
    });
    setCreateProductOpen(false);
  }

  async function onCreateStockItem(dto: {
    productId: string;
    quantity?: number;
    location?: string;
  }) {
    if (!pid) return;
    await createItem.mutateAsync({ projectId: pid, ...dto });
    pushToast({ title: t("stock.toast.itemCreated"), kind: "success" });
    setCreateItemOpen(false);
  }

  async function onAdjustStock(dto: {
    type: "IN" | "OUT";
    quantity: number;
    reason?: string;
  }) {
    if (!pid || !activeItemId) return;

    await adjust.mutateAsync({
      projectId: pid,
      stockItemId: activeItemId,
      type: dto.type,
      quantity: dto.quantity,
      reason: dto.reason,
    });

    pushToast({ title: t("stock.toast.adjusted"), kind: "success" });
    setAdjustOpen(false);
  }

  if (!pid) {
    return (
      <EmptyState
        title={t("stock.noProjectTitle")}
        subtitle={t("stock.noProjectSubtitle")}
      />
    );
  }

  const loadError =
    (itemsQ.error as any)?.response?.data?.message ||
    (itemsQ.error as Error | undefined)?.message ||
    (productsQ.error as any)?.response?.data?.message ||
    (productsQ.error as Error | undefined)?.message ||
    null;

  if (itemsQ.isError || productsQ.isError) {
    return (
      <EmptyState
        title={t("stock.errorTitle")}
        subtitle={loadError || t("common.error")}
        action={
          <button
            className="btn-primary"
            onClick={() => {
              itemsQ.refetch();
              productsQ.refetch();
            }}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold">{t("stock.title")}</h1>
          <p className="text-sm text-mutedForeground mt-1">
            {t("stock.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="btn-outline"
            onClick={() => setCreateProductOpen(true)}
          >
            {t("stock.newProduct")}
          </button>
          <button
            className="btn-primary"
            onClick={() => setCreateItemOpen(true)}
            disabled={!products.length}
            title={!products.length ? t("stock.needProductFirst") : undefined}
          >
            {t("stock.addToProject")}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: items */}
        <div className="lg:col-span-5">
          <SectionCard
            title={t("stock.itemsTitle")}
            right={
              <input
                className="input w-72 max-w-[60vw]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("stock.searchPlaceholder")}
              />
            }
          >
            {itemsQ.isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="h-4 w-40 bg-muted rounded-xl animate-pulse" />
                    <div className="mt-2 h-4 w-24 bg-muted rounded-xl animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <EmptyState
                title={t("stock.emptyTitle")}
                subtitle={t("stock.emptySubtitle")}
                action={
                  <button
                    className="btn-primary"
                    onClick={() => setCreateItemOpen(true)}
                    disabled={!products.length}
                  >
                    {t("stock.addToProject")}
                  </button>
                }
              />
            ) : (
              <div className="grid gap-2">
                {filteredItems.map((it) => {
                  const isActive = it._id === activeItemId;
                  return (
                    <button
                      key={it._id}
                      type="button"
                      onClick={() => setActiveItemId(it._id)}
                      className={[
                        "w-full text-left rounded-2xl border p-4 transition",
                        "bg-card border-border hover:bg-muted",
                        isActive ? "ring-2 ring-[hsl(var(--ring)/0.20)]" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold truncate">
                            {productNameFromStockItem(it)}
                          </div>
                          <div className="mt-1 text-xs text-mutedForeground">
                            {t("stock.location")}:{" "}
                            <span className="text-foreground font-semibold">
                              {it.location || t("stock.locationNone")}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-xs text-mutedForeground">
                            {t("stock.qty")}
                          </div>
                          <div className="text-lg font-extrabold">
                            {it.quantity}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right: details + movements */}
        <div className="lg:col-span-7 space-y-4">
          <SectionCard
            title={t("stock.detailsTitle")}
            right={
              <button
                className="btn-primary"
                onClick={() => setAdjustOpen(true)}
                disabled={!activeItemId}
              >
                {adjust.isPending ? t("stock.saving") : t("stock.adjust")}
              </button>
            }
          >
            {!activeItem ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center">
                <div className="text-sm font-extrabold">
                  {t("stock.selectItemTitle")}
                </div>
                <div className="mt-1 text-xs text-mutedForeground">
                  {t("stock.selectItemSubtitle")}
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border p-4">
                  <div className="text-xs text-mutedForeground">
                    {t("stock.product")}
                  </div>
                  <div className="mt-1 text-base font-extrabold">
                    {productNameFromStockItem(activeItem)}
                  </div>
                  <div className="mt-2 text-sm text-mutedForeground">
                    {t("stock.location")}:{" "}
                    <span className="font-semibold text-foreground">
                      {activeItem.location || t("stock.locationNone")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border p-4">
                    <div className="text-xs text-mutedForeground">
                      {t("stock.currentQty")}
                    </div>
                    <div className="mt-1 text-2xl font-extrabold">
                      {activeItem.quantity}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <div className="text-xs text-mutedForeground">
                      {t("stock.itemId")}
                    </div>
                    <div className="mt-1 text-sm font-extrabold break-all">
                      {activeItem._id}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title={t("stock.movementsTitle")}
            right={
              <button
                className="btn-outline"
                onClick={() => movesQ.refetch()}
                disabled={!activeItemId || movesQ.isFetching}
                title={!activeItemId ? t("stock.selectItemFirst") : undefined}
              >
                {movesQ.isFetching ? t("common.loading") : t("common.refresh")}
              </button>
            }
          >
            {!activeItemId ? (
              <div className="text-sm text-mutedForeground">
                {t("stock.selectItemFirst")}
              </div>
            ) : movesQ.isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="h-4 w-48 bg-muted rounded-xl animate-pulse" />
                    <div className="mt-2 h-4 w-2/3 bg-muted rounded-xl animate-pulse" />
                  </div>
                ))}
              </div>
            ) : movesQ.isError ? (
              <EmptyState
                title={t("stock.movementsErrorTitle")}
                subtitle={
                  (movesQ.error as any)?.response?.data?.message ||
                  (movesQ.error as Error | undefined)?.message ||
                  t("common.error")
                }
                action={
                  <button
                    className="btn-primary"
                    onClick={() => movesQ.refetch()}
                  >
                    {t("common.retry")}
                  </button>
                }
              />
            ) : (movesQ.data || []).length === 0 ? (
              <EmptyState
                title={t("stock.movementsEmptyTitle")}
                subtitle={t("stock.movementsEmptySubtitle")}
              />
            ) : (
              <div className="grid gap-2">
                {(movesQ.data || []).map((m) => (
                  <div
                    key={m._id}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <MovementBadge type={m.type} />
                          <div className="text-sm font-extrabold truncate">
                            {movementProductName(m)}
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-mutedForeground">
                          {t("stock.reason")}:{" "}
                          <span className="text-foreground font-semibold">
                            {m.reason || t("stock.reasonNone")}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-mutedForeground flex flex-wrap gap-2">
                          <span>{formatDate(m.createdAt)}</span>
                          {movementUserName(m) ? (
                            <>
                              <span>•</span>
                              <span>{movementUserName(m)}</span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-xs text-mutedForeground">
                          {t("stock.qty")}
                        </div>
                        <div className="text-lg font-extrabold">
                          {m.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Modals */}
      {createProductOpen && (
        <CreateProductModal
          onClose={() => setCreateProductOpen(false)}
          onCreate={onCreateProduct}
          isPending={createProduct.isPending}
          errorMessage={
            createProduct.isError
              ? (createProduct.error as any)?.response?.data?.message ||
                (createProduct.error as Error).message
              : null
          }
        />
      )}

      {createItemOpen && (
        <CreateStockItemModal
          products={products}
          onClose={() => setCreateItemOpen(false)}
          onCreate={onCreateStockItem}
          isPending={createItem.isPending}
          errorMessage={
            createItem.isError
              ? (createItem.error as any)?.response?.data?.message ||
                (createItem.error as Error).message
              : null
          }
        />
      )}

      {adjustOpen && activeItemId && (
        <AdjustStockModal
          onClose={() => setAdjustOpen(false)}
          onSave={onAdjustStock}
          isPending={adjust.isPending}
          errorMessage={
            adjust.isError
              ? (adjust.error as any)?.response?.data?.message ||
                (adjust.error as Error).message
              : null
          }
        />
      )}
    </div>
  );
}
