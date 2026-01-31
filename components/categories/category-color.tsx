const CategoryColor = ({ color }: { color: string }) => {
	return <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>;
};

export default CategoryColor;
