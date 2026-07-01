"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Divider, Form, Pagination, Select, Skeleton, Spin, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EscapeCard from "./EscapeCard";
import Card from "./meta/Card";
import { searchBrowseEscapes } from "../lib/actions";
import { ID_FRANCE } from "../lib/browseQuery";
import { mediaUrl } from "../lib/media";

/**
 * T407 — partie interactive de la page Browse. La persistance du filtre
 * passe par les paramètres d'URL (`f`, `sort`, `page`, `size`) au lieu du
 * sessionStorage de l'ancienne version : les résultats filtrés restent donc
 * partageables par lien, et un minimum crawlables. Simplification assumée :
 * le filtre est encodé en un seul paramètre JSON plutôt qu'un paramètre par
 * champ (à affiner plus tard si on veut des URLs par filtre individuel).
 */
export default function BrowseFilters({ tagslist, payslist, regroupements, presetList, initialList }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilter = useMemo(() => {
    try {
      return JSON.parse(searchParams.get("f") || "{}");
    } catch {
      return {};
    }
  }, [searchParams]);

  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState(searchParams.get("sort") || "date:DESC");
  const [escapeList, setEscapeList] = useState(initialList);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [size, setSize] = useState(Number(searchParams.get("size") || 5));

  const [regionList, setRegionList] = useState(() => {
    const p = payslist.find((n) => n.id === initialFilter["addresses.pay.id"]);
    return p ? p.regions : null;
  });
  const [regroupementList, setRegroupementList] = useState([]);
  const displayLang = initialFilter["addresses.pay.id"] && initialFilter["addresses.pay.id"] !== ID_FRANCE;

  const formRef = useRef(null);
  const searchTop = useRef(null);

  function pushUrlState(nextFilter, nextSort, nextPage, nextSize) {
    const params = new URLSearchParams();
    params.set("f", JSON.stringify(nextFilter));
    params.set("sort", nextSort);
    params.set("page", String(nextPage));
    params.set("size", String(nextSize));
    router.replace(`/escapegame?${params.toString()}`, { scroll: false });
  }

  function runSearch(nextFilter, nextSort, nextPage = 1, nextSize = size) {
    setFilter(nextFilter);
    setSort(nextSort);
    setPage(nextPage);
    if (nextSize) setSize(nextSize);
    pushUrlState(nextFilter, nextSort, nextPage, nextSize || size);
    startTransition(async () => {
      const list = await searchBrowseEscapes(nextFilter, nextSort);
      setEscapeList(list);
    });
  }

  function onPaysChange(selectedPaysId) {
    const p = payslist.find((n) => n.id === selectedPaysId);
    setRegionList(p ? p.regions : null);
    setRegroupementList([]);
    const next = { ...filter, "addresses.pay.id": selectedPaysId || false, "addresses.region.id": [], "addresses.regroupement.id": false };
    if (!(selectedPaysId && selectedPaysId !== ID_FRANCE)) next.english = [];
    runSearch(next, sort);
  }

  function onRegionChange(selected) {
    const list = regroupements && selected?.length > 0 ? regroupements.filter((n) => selected.includes(n.region.id)) : [];
    setRegroupementList(list);
    runSearch({ ...filter, "addresses.region.id": selected, "addresses.regroupement.id": false }, sort);
  }

  function onFieldChange(field, value) {
    runSearch({ ...filter, [field]: value }, sort);
  }

  function onTagCheckbox(tagId, checked) {
    const next = { ...filter };
    if (checked) next[`tags-${tagId}`] = true;
    else delete next[`tags-${tagId}`];
    runSearch(next, sort);
  }

  function onSortChange(value) {
    runSearch(filter, value);
  }

  function reset() {
    setRegionList(null);
    setRegroupementList([]);
    runSearch({}, "date:DESC", 1, 5);
  }

  function applyPreset(preset) {
    runSearch(preset || {}, sort);
    executeScroll();
  }

  function executeScroll() {
    searchTop.current?.scrollIntoView();
  }

  const currentPageList = escapeList.slice((page - 1) * size, (page - 1) * size + size);

  return (
    <div className="browse-main">
      {presetList?.length > 0 && (
        <div className="browse-presets">
          {presetList.map((n) =>
            !n.preset ? (
              <div key={n.id} style={{ width: "100%" }}>&nbsp;</div>
            ) : (
              <Card
                key={n.id}
                className="preset-card"
                reduce
                url="#"
                arrow={false}
                bigText={n.name}
                compact
                imageTitle={n.description}
                imageUrl={n.illustration ? mediaUrl(n.illustration.url) : null}
                onClick={(e) => {
                  e.preventDefault();
                  applyPreset(n.preset);
                }}
              />
            )
          )}
          <Card className="search-card" reduce url="/search" bigText={<SearchOutlined />} compact arrow={false} />
        </div>
      )}

      <div className="browse-sort" ref={searchTop}>
        <h3>Trouvez votre prochaine escape</h3>
        <div className="sort-by">
          <Form.Item label="Trier par">
            <Select value={sort} onChange={onSortChange}>
              <Select.Option value="date:DESC">Date</Select.Option>
              <Select.Option value="rate:DESC,date:DESC">Note</Select.Option>
              <Select.Option value="name:ASC">Nom</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="browse">
        <div className="browse-filter">
          <Form ref={formRef} layout="vertical">
            <Divider orientation="left" />
            <Form.Item label="Pays">
              <Select value={filter["addresses.pay.id"] || false} onChange={onPaysChange}>
                <Select.Option value={false}>Tous</Select.Option>
                {payslist
                  .filter((n) => n.id === ID_FRANCE)
                  .map((n) => <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>)}
                <Select.Option value="row">Reste du monde</Select.Option>
                <Select.OptGroup label="-----">
                  {payslist
                    .filter((n) => n.id !== ID_FRANCE)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((n) => <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>)}
                </Select.OptGroup>
              </Select>
            </Form.Item>

            {regionList && regionList.length > 0 && (
              <Form.Item label="Régions">
                <Select
                  value={filter["addresses.region.id"] || []}
                  onChange={onRegionChange}
                  mode="multiple"
                  placeholder="Régions"
                  showSearch={false}
                >
                  {regionList.map((n) => <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>)}
                </Select>
              </Form.Item>
            )}

            {regroupementList.length > 0 && (
              <Form.Item label="">
                <Select value={filter["addresses.regroupement.id"] || false} onChange={(v) => onFieldChange("addresses.regroupement.id", v)}>
                  <Select.Option value={false}> </Select.Option>
                  {regroupementList.map((n) => <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>)}
                </Select>
              </Form.Item>
            )}

            {displayLang && (
              <div>
                <Divider orientation="left" />
                <p className="top-sec">Anglais requis:</p>
                <div className="chkbx-tags">
                  <Form.Item label="">
                    <Select value={filter.english || []} onChange={(v) => onFieldChange("english", v)} mode="multiple" placeholder="Anglais requis" showSearch={false}>
                      {tagslist.filter((n) => n.english === true).map((n) => <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            )}

            <Divider orientation="left" />
            <Form.Item label="Nombre de joueurs">
              <Select value={filter.nbplayer || false} onChange={(v) => onFieldChange("nbplayer", v)}>
                <Select.Option value={false}> </Select.Option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((v) => (
                  <Select.Option value={v} key={v}>{v === 11 ? "10+" : v}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Divider orientation="left" />
            <p className="top-sec">Mentions spéciales</p>
            <div className="chkbx-tags">
              {tagslist
                .filter((n) => n.isMention === true && n.isGold === false && !n.english)
                .map((n) => (
                  <div key={n.id}>
                    <Checkbox checked={!!filter[`tags-${n.id}`]} onChange={(e) => onTagCheckbox(n.id, e.target.checked)} title={n.description}>
                      {n.name}
                    </Checkbox>
                  </div>
                ))}
            </div>

            <Divider orientation="left" />
            <p className="top-sec">Tags</p>
            <div className="chkbx-tags">
              {tagslist
                .filter((n) => n.isMention === false && n.isGold === false && !n.english)
                .map((n) => (
                  <Checkbox key={n.id} checked={!!filter[`tags-${n.id}`]} onChange={(e) => onTagCheckbox(n.id, e.target.checked)} title={n.description}>
                    {n.name}
                  </Checkbox>
                ))}
            </div>

            <Divider orientation="left" />
            <Form.Item label="">
              <Select value={filter.gold || []} onChange={(v) => onFieldChange("gold", v)} mode="multiple" placeholder="Glandus d'Or">
                {tagslist
                  .filter((n) => n.isMention === false && n.isGold === true && !n.english)
                  .map((n) => <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>)}
              </Select>
            </Form.Item>

            <Divider />
            <Button onClick={reset}>Reset</Button>
          </Form>
        </div>

        <div className="browse-result">
          <div>
            <div>{isPending && <p className="loading-spin"><Spin /></p>}</div>
            {!isPending && currentPageList.length === 0 && <Skeleton active avatar />}
            {currentPageList.map((n) => (
              <EscapeCard key={n.id} escape={n} enseigne={n.enseigne} />
            ))}
          </div>
          <div className="pagination">
            <Pagination
              current={page}
              total={escapeList.length}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50]}
              pageSize={size}
              onChange={(p, s) => runSearch(filter, sort, p, s)}
              onShowSizeChange={(p, s) => runSearch(filter, sort, p, s)}
              showTotal={(t) => <span>{t} Escape{t > 1 ? "s" : ""}</span>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
