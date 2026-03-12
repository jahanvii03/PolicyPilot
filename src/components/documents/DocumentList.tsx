import { useState } from "react";
import {
  FileIcon,
  PanelRightClose,
  PanelRightOpen,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
import { useDocuments } from "../../hooks/useDocument";

export function DocumentList() {
  const [isOpen, setIsOpen] = useState(true);
  const { documents, isLoading } = useDocuments();

  return (
    <>
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 z-50 rounded-full shadow-md md:right-4 md:top-20 md:bottom-auto"
          aria-label="Open documents"
        >
          <PanelRightOpen size={18} />
        </Button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <aside
            className="
              fixed inset-x-0 bottom-0 z-50
              h-[85vh] w-full
              rounded-t-2xl border-t border-slate-200 bg-white
              flex flex-col shadow-xl

              sm:h-[80vh]
              md:left-auto md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[360px] md:rounded-none md:border-t-0 md:border-l
              lg:static lg:z-auto lg:h-full lg:w-[340px] lg:shadow-none
              xl:w-[380px]
              2xl:w-[420px]
            "
          >
            <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-700">
                  Policy Documents
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isLoading ? "Loading..." : `${documents.length} documents`}
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Close panel"
                aria-label="Close documents"
              >
                <PanelRightClose size={16} />
              </button>
            </div>

            <ul
              className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
              role="list"
            >
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-3 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1 min-w-0">
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-4/5" />
                      <div className="h-2 bg-slate-100 rounded animate-pulse w-2/5" />
                    </div>
                  </li>
                ))
              ) : documents.length === 0 ? (
                <li className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                    <FileIcon size={18} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    No documents
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No policies yet
                  </p>
                </li>
              ) : (
                documents.map((doc) => (
                  <li key={doc.id}>
                    <button
                      type="button"
                      onClick={() => window.open(doc.url, "_blank")}
                      className="
                        w-full text-left
                        flex items-start gap-3 px-3 py-2.5 rounded-xl
                        hover:bg-slate-50 active:bg-slate-100
                        transition-colors group
                      "
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-50 transition-colors">
                        <FileIcon
                          size={14}
                          className="text-slate-400 group-hover:text-blue-500 transition-colors"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 font-medium leading-snug break-words group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </p>

                        <span className="mt-1 flex items-start gap-1 text-[10px] text-slate-400 min-w-0">
                          <MapPin
                            size={10}
                            className="mt-[1px] flex-shrink-0"
                          />
                          <span className="break-all">{doc.updated}</span>
                        </span>
                      </div>

                      <div className="self-center opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>
        </>
      )}
    </>
  );
}
