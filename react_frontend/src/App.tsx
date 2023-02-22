import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const addData = async (title: string, imgurl: string) => {
  const response = await fetch("http://localhost:3001/add_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, imgurl }),
  });
  if (!response.ok) {
    throw new Error("Failed to add data");
  }
  const result = await response.text();
  console.log(result);
}; // i made a function to add data to the , but i dont really need it for this project

// Pagination

function Items({ currentItems }: any) {
  return (
    <div className="data">
      {currentItems &&
        currentItems.map((item: any) => (
          <div key={item.imgurl}>
            <p>{item.title}</p>
            <img src={item.imgurl} />
          </div>
        ))}
    </div>
  );
}

function PaginatedItems({ itemsPerPage }: any) {
  const [itemOffset, setItemOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  async function getData() {
    setIsLoading(true);
    let data = await fetch("http://localhost:3001/data").then((data) =>
      data.json()
    ); // fetches data from the server
    console.log(data);
    setItems(data);
    setIsLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Items currentItems={currentItems} />
      <div className="paginatenavbar">
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel="< previous"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
        />
      </div>
    </>
  );
}

// end Pagiation

function App() {
  return (
    <div>
      <PaginatedItems itemsPerPage={9} />
    </div>
  );
}
export default App;
