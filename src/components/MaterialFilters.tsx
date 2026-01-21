interface MaterialFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function MaterialFilters({
  searchTerm,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange
}: MaterialFiltersProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar materiales..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 text-gray-900 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
