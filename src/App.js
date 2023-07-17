import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import apiRequest from "./apiRequest";
import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [error,setError]= useState(null)
  const [isLoading, setIsLoading] = useState(true);

  const url = "http://localhost:3500/items";

  useEffect(() => {
    const fetchItems = async() =>{
      try {
        const response = await fetch(url);
        if (!response.ok) throw Error("data no accsesable");
        const newItems = await response.json();
        setItems(newItems);
        setError(null);
      } catch (er) {
        setError(er.message);
      } finally {
        setIsLoading(false);
      }
      
    }

    setTimeout(() => fetchItems(), 2000);
  }, []);

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
    const newData={ 
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
  }
    const result= await apiRequest(url, newData)
    if (result) setError(result)
  };

  const handleCheck = async(id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);
    const newCheck= items.filter((item)=> id=== item.id)

    const newData={ 
      method:'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({checked: newCheck[0].checked})
  }
    const rqulr= "${url}/${id}"
    const result= await apiRequest(rqulr, newData)
    if (result) setError(result)
  };

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteOptions = { method: 'DELETE' };
    const reqUrl = `${url}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) setError(result);
  }
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <Content
        items={items.filter((item) =>
          item.item.toLowerCase().includes(search.toLowerCase())
        )}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default App;
