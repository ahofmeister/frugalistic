const CategoryNameColor = ({ name, color }: { name: string; color: string }) => {
	return (
		<span className="flex gap-x-1.5 items-center">
			<span className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
			{name}
		</span>
	);
};

export default CategoryNameColor;
