import '../../assets/css/adminList.css';

function List({ data, columns }) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                    <tr key={item.id}>
                        {columns.map((col) => (
                            <td key={col.key}>
                                <div className="cell-content">
                                    {col.key === "index"
                                        ? idx + 1
                                        : col.render
                                            ? col.render(item)
                                            : item[col.key] ?? "-"}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default List;