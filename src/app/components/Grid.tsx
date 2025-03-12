import { useState } from "react";

export default function GridComponent() {
    const [items, setItems] = useState([
        "Item 1", "Item 2", "Item 3",
        "Item 4", "Item 5", "Item 6",
    ]);

    const addItem = () => {
        setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
    };

    return (
        <div className="h-full w-full flex flex-wrap overflow-hidden max-h-max">
            {/* Scrollable Grid Container */}
            <div className="flex-1 overflow-auto flex-wrap-reverse flex flex-wrap gap-4 justify-start items-start max-h-full h-max">
                {items.map((item, index) => (
                    <div key={index} className="bg-blue-500 text-white p-4 rounded w-[calc(33.333%-1rem)] max-h-max">
                        {item}
                    </div>
                ))}
            </div>

            {/* Button to add new item */}
            <button
                onClick={addItem}
                className="p-2 bg-green-500 text-white rounded m-4"
            >
                Add Item
            </button>
        </div>
    );
}
