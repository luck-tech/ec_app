import {JSX, Suspense, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useSuspenseQuery} from "@tanstack/react-query";
import {searchProducts} from "@/api/products";
import {NUMBER_OF_PRODUCTS_PER_PAGE} from "@/constants";
import {Loading} from "@/components/loading";
import {ProductList} from "@/components/product_list";

export function SearchPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const currentFilter = searchParams.get("filter") || "";

  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<Loading />}>
        <SearchForm currentFilter={currentFilter} />
        <ProductsPanel page={currentPage} filter={currentFilter} />
      </Suspense>
    </div>
  );
}

function SearchForm({currentFilter}: {currentFilter: string}): JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(currentFilter);

  const handleFilterInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = event => {
    setFilter(event.target.value);
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    if (filter === "") {
      navigate("/");
      return;
    }
    navigate(`/?filter=${filter}`);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-row justify-center gap-4"
    >
      <input
        type="text"
        placeholder="Search products..."
        defaultValue={currentFilter}
        onChange={handleFilterInputChange}
        className="border p-2 w-72"
        data-test="search-input"
      />
      <button
        type="submit"
        className="px-6 py-2 text-lg text-white rounded-lg bg-orange-400"
        data-test="search-button"
      >
        Search
      </button>
    </form>
  );
}

function ProductsPanel({
  page,
  filter,
}: {
  page: number;
  filter: string;
}): JSX.Element {
  const {
    data: {products, hitCount},
  } = useSuspenseQuery({
    queryKey: ["products", "search", page, filter],
    queryFn: () => searchProducts({page, filter}),
  });

  return (
    <>
      <ProductList products={products} />
      <Pagination page={page} filter={filter} hitCount={hitCount} />
    </>
  );
}

function Pagination({
  page,
  filter,
  hitCount,
}: {
  page: number;
  filter: string;
  hitCount: number;
}): JSX.Element {
  const navigate = useNavigate();
  const isLast = hitCount <= page * NUMBER_OF_PRODUCTS_PER_PAGE;

  const handlePrevPageClick = (): void => {
    if (filter === "") {
      navigate(`/?page=${page - 1}`);
      return;
    }
    navigate(`/?page=${page - 1}&filter=${filter}`);
  };

  const handleNextPageClick = (): void => {
    if (filter === "") {
      navigate(`/?page=${page + 1}`);
      return;
    }
    navigate(`/?page=${page + 1}&filter=${filter}`);
  };

  return (
    <div className="flex flex-row justify-center gap-4">
      <button
        onClick={handlePrevPageClick}
        disabled={page === 1}
        className="text-lg disabled:text-gray-400"
        data-test="prev-button"
      >
        Prev
      </button>
      <span className="text-lg" data-test="current-page">
        {page}
      </span>
      <button
        onClick={handleNextPageClick}
        disabled={isLast}
        className="text-lg disabled:text-gray-400"
        data-test="next-button"
      >
        Next
      </button>
    </div>
  );
}
