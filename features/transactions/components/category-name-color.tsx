const CategoryNameColor = ({ name, color }: { name: string; color: string }) => {
	return (
		<div className="flex gap-x-1.5 items-center">
			<div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
			{name}
		</div>
	);
};

export default CategoryNameColor;
