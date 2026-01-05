// src/pages/StockPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import EmptyState from "../components/EmptyState";

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

import { useToastStore } from "../store/toast.store";

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

export default function StockPage() {
  const { projectId } = useParams();
  const pid = projectId || null;

  const push = useToastStore((s) => s.push);

  // products catalog
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

  const products = productsQ.data || [];
  const items = itemsQ.data || [];
  const movements = movesQ.data || [];

  const activeItem = useMemo(
    () => items.find((x) => x._id === activeItemId) || null,
    [items, activeItemId]
  );

  useEffect(() => {
    if (!activeItemId && items.length > 0) setActiveItemId(items[0]._id);
  }, [items, activeItemId]);

  if (!pid) {
    return (
      <EmptyState
        title="Missing projectId"
        subtitle="Open stock from inside a project."
      />
    );
  }

  async function onCreateProduct(dto: {
    name: string;
    sku?: string;
    unit?: string;
  }) {
    const created = await createProduct.mutateAsync(dto);
    setCreateProductOpen(false);
    push({ kind: "success", title: "Product created", message: created.name });
  }

  async function onCreateStockItem(dto: {
    productId: string;
    quantity?: number;
    location?: string;
  }) {
    const created = await createItem.mutateAsync({
      projectId: pid,
      productId: dto.productId,
      quantity: dto.quantity ?? 0,
      location: dto.location,
    });

    setCreateItemOpen(false);
    push({ kind: "success", title: "Stock item created" });
    setActiveItemId(created._id);
  }

  async function onAdjustStock(dto: {
    type: "IN" | "OUT";
    quantity: number;
    reason?: string;
  }) {
    if (!activeItemId) return;

    await adjust.mutateAsync({
      stockItemId: activeItemId,
      type: dto.type,
      quantity: dto.quantity,
      reason: dto.reason,
    });

    setAdjustOpen(false);
    push({ kind: "success", title: "Stock updated" });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Left: Items */}
      <div className="lg:col-span-2 space-y-4">
        <SectionCard title="Project stock">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="text-xs text-slate-500">{items.length} items</div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCreateProductOpen(true)}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
              >
                + Product
              </button>

              <button
                type="button"
                onClick={() => setCreateItemOpen(true)}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white"
              >
                + Stock item
              </button>
            </div>
          </div>

          {itemsQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : itemsQ.isError ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {(itemsQ.error as any)?.response?.data?.message ||
                (itemsQ.error as Error).message}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <div className="text-sm font-semibold text-slate-900">
                No stock items yet
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Create a product, then create a stock item for this project.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((it: StockItem) => (
                <button
                  key={it._id}
                  type="button"
                  onClick={() => setActiveItemId(it._id)}
                  className={[
                    "w-full text-left rounded-xl border px-4 py-3 transition",
                    it._id === activeItemId
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="font-semibold text-slate-900">
                    {productNameFromStockItem(it)}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    Qty:{" "}
                    <span className="font-extrabold text-slate-900">
                      {it.quantity}
                    </span>
                    {it.location ? (
                      <span className="ml-2 text-slate-400">
                        • {it.location}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Right: Movements */}
      <div className="lg:col-span-3">
        <SectionCard title="Movements">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div className="text-sm text-slate-600">
              {activeItem ? (
                <>
                  Item:{" "}
                  <span className="font-extrabold text-slate-900">
                    {productNameFromStockItem(activeItem)}
                  </span>{" "}
                  · Current qty:{" "}
                  <span className="font-extrabold text-slate-900">
                    {activeItem.quantity}
                  </span>
                </>
              ) : (
                "Select a stock item"
              )}
            </div>

            <button
              type="button"
              disabled={!activeItemId || adjust.isPending}
              onClick={() => setAdjustOpen(true)}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              title={!activeItemId ? "Select an item first" : "Adjust stock"}
            >
              {adjust.isPending ? "Saving..." : "+ Adjust"}
            </button>
          </div>

          {movesQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : movesQ.isError ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {(movesQ.error as any)?.response?.data?.message ||
                (movesQ.error as Error).message}
            </div>
          ) : movements.length === 0 ? (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              No movements yet. Click “+ Adjust” to create IN / OUT.
            </div>
          ) : (
            <div className="space-y-2">
              {movements
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((m) => {
                  const who = movementUserName(m);
                  const label = movementProductName(m);

                  return (
                    <div
                      key={m._id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-extrabold text-slate-900">
                            {m.type}{" "}
                            <span className="font-semibold">
                              {m.type === "OUT" ? "-" : "+"}
                              {m.quantity}
                            </span>{" "}
                            <span className="text-slate-500 text-sm font-semibold">
                              • {label}
                            </span>
                          </div>

                          {m.reason ? (
                            <div className="text-sm text-slate-600 mt-1">
                              {m.reason}
                            </div>
                          ) : null}

                          {who ? (
                            <div className="text-xs text-slate-400 mt-1">
                              By {who}
                            </div>
                          ) : null}
                        </div>

                        <div className="text-xs text-slate-400">
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </SectionCard>
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

      {adjustOpen && activeItem && (
        <AdjustStockModal
          itemName={productNameFromStockItem(activeItem)}
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
