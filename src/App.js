import React, { useState } from 'react';
import './App.css';
const initialTableData = [
  {
    title: "Inches",
    content: [
      ['Option Value', 'Size', 'Length', 'Width'],
      ['26', 'XS', '100 inch', '50 inch'],
      ['28', 'L', '120 inch', '550 inch'],
      ['25', 'S', '130 inch', '250 inch'],
    ]
  },
  {
    title: "CM",
    content: [
      ['Option Value', 'Size', 'Length', 'Width'],
      ['100', 'M', '100 cm', '50 cm'],
      ['200', 'L', '120 cm', '550 cm'],
      ['200', 'XS', '130 cm', '250 cm'],
    ]
  }
];
const App = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tableData, setTableData] = useState(initialTableData);
  const handleCellChange = (rowIndex, colIndex, value) => {
    const title = tableData[currentTabIndex].title
    const content = [...tableData[currentTabIndex].content];
    content[rowIndex][colIndex] = value;
    const data = { title, content }
    updateTableDataHandler(data);
  };
  const deleteTab = (index) => {
    if (tableData.length !== 1) {
      setTableData((prev) => {
        return prev.filter((num, i) => i !== index)
      });
    } else {
      console.log("show Tost message")
    }
    if (currentTabIndex === 0) {
      setCurrentTabIndex(currentTabIndex)
    } else {
      setCurrentTabIndex(currentTabIndex - 1)
    }

  }
  // Tab input onchange handler
  const handleTabTitleChange = (e, index) => {
    const { value } = e.target
    setTableData((prev) => {
      return prev.map((cv, i) => {
        if (i === index) {
          return {
            title: value,
            content: cv.content,

          }
        } else {
          return cv
        }
      })
    });
  }
  const updateTableDataHandler = (data) => {
    setTableData((prev) => {
      return prev.map((cv) => {
        if (cv.title === data.title) {
          return data
        } else {
          return cv
        }
      })
    });
  }
  // add Row 
  const addRow = () => {
    const title = tableData[currentTabIndex].title
    const data = { title, content: [...tableData[currentTabIndex].content, Array(tableData[currentTabIndex].content[currentTabIndex].length).fill('')] }
    updateTableDataHandler(data)
  };
  // add Column
  const addColumn = () => {
    const title = tableData[currentTabIndex].title
    const data = {
      title,
      content: tableData[currentTabIndex].content.map((row) => [...row, ""])
    }
    updateTableDataHandler(data)
  };
  // duplicate rows
  const duplicateRow = (index) => {
    const title = tableData[currentTabIndex].title
    const content = [...tableData[currentTabIndex].content]
    content.splice(index + 1, 0, tableData[currentTabIndex].content[index])
    const data = { title, content }
    updateTableDataHandler(data)
  };
  // duplicate column
  const duplicateColumn = (index) => {
    const title = tableData[currentTabIndex].title
    const content = tableData[currentTabIndex].content.map(row => [...row.slice(0, index + 1), row[index], ...row.slice(index + 1)]);
    const data = { title, content }
    updateTableDataHandler(data)
  };
  // delete column
  const deleteColumn = (index) => {
    const title = tableData[currentTabIndex].title
    const content = tableData[currentTabIndex].content.map(row => {
      const newRow = [...row];
      newRow.splice(index, 1);
      return newRow;
    });
    const data = { title, content }
    updateTableDataHandler(data)
  };
  // delete row
  const deleteRow = (index) => {
    // Remove a row by filtering out the selected index
    const title = tableData[currentTabIndex].title
    const content = tableData[currentTabIndex].content.filter((_, i) => i !== index);
    const data = { title, content }
    updateTableDataHandler(data)
  };
  // add tab
  const addTab = () => {
    setTableData((prev) => {
      return [
        ...prev,
        {
          title: `Tab ${prev.length + 1}`,
          content: [
            ['Option Value', 'Size', 'Length', 'Width'],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
          ]
        }
      ]
    })
    setCurrentTabIndex(tableData.length)
  }
  console.log(tableData, 'tableData')
  const lastRow = tableData[currentTabIndex].content[0]
  return (
    <div className="sc_dynamic_table">
      <div className='sc_dynamic_table__container'>
        <div className='sc_dynamic_table__header'>
          <div className='sc_dynamic_table__tab_wrapper'>
            <div className='sc_dynamic_table__tabs'>
              {
                tableData.map((cv, index) => {
                  return <p className={`${index === currentTabIndex ? "active" : ""}`}>
                    <input
                      onChange={(e) => handleTabTitleChange(e, index)}
                      onFocus={() => setCurrentTabIndex(index)}
                      value={cv.title}
                      autoFocus={index === currentTabIndex}
                    />
                    <span className='icon' onClick={() => deleteTab(index)}><TableDelete tab={true} /></span></p>
                })
              }
            </div>
            <div className='sc_dynamic_table__tab_add_btn'>
              <button className='sc_btn' onClick={addTab}>Add Tab</button>
            </div>
          </div>
          <div className='sc_dynamic_table__column_btn'>
            <button onClick={addColumn} className='sc_btn'>Add Column</button>
          </div>
        </div>
        <table className="sc_dynamic_table_main">
          <tbody>
            {tableData[currentTabIndex].content.map((row, rowIndex) => (
              <>
                <tr key={rowIndex} className='sc_dynamic_table_row'>
                  {row.map((cell, colIndex) => (
                    <>
                      {
                        rowIndex === 0 ?
                          // show option , size , length ,width row as table header
                          <th key={colIndex} className='sc_dynamic_table_header' >
                            <input
                              type="text"
                              value={cell}

                              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            />
                          </th> :
                          // show rest of table row as table data  cell
                          <td key={colIndex} className='sc_dynamic_table_data'>
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            />
                          </td>
                      }
                      {/* show actions Duplicate row and delete row   */}
                      {
                        colIndex === row.length - 1 ?
                          rowIndex === 0 ? <th className='sc_dynamic_table_header last' key={colIndex}>Actions</th> :
                            <td className='sc_dynamic_table_data last'><span onClick={() => duplicateRow(rowIndex)}><TableCopyIcon row={true} /></span><span onClick={() => deleteRow(rowIndex)}><TableDelete row={true} /></span></td> : ""
                      }
                    </>
                  ))}
                </tr>
              </>
            ))}
          </tbody>
          <tfoot>
            {/* show last row as duplicate column and delete column */}
            <tr className='sc_dynamic_table_row last'>
              {
                lastRow.map((cv, i) => {
                  return <td className='sc_dynamic_table_data last' key={i}>
                    <span onClick={() => duplicateColumn(i)}><TableCopyIcon row={false} /></span>
                    <span onClick={() => deleteColumn(i)}> <TableDelete row={false} /></span>
                  </td>
                })
              }
              <td className='sc_dynamic_table_data last'></td>
            </tr>
          </tfoot>
        </table>
        <div className='sc_dynamic_table_footer'>
          <button onClick={addRow} className='sc_btn'>Add Row</button>
        </div>
      </div>
    </div>
  );
};
export default App;
const TableCopyIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <path
      fill="#616A75"
      d="M12.012 6.072a1.295 1.295 0 0 0-1.296 1.296v8.204a.864.864 0 0 0 .864.864h8.204a1.295 1.295 0 0 0 1.296-1.296V7.368a1.296 1.296 0 0 0-1.296-1.296h-7.772ZM8.557 9.527h.432v8.636h8.636v.432a1.295 1.295 0 0 1-1.295 1.295H8.557a1.296 1.296 0 0 1-1.295-1.295v-7.773a1.295 1.295 0 0 1 1.295-1.295Z"
    />
    {
      props.row ? <title>Duplicate Row</title> : <title>Duplicate Column</title>
    }
  </svg>
)
const TableDelete = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <path
      fill="#616A75"
      d="M6.366 9.606h11.58v9.41a.723.723 0 0 1-.724.724H7.09a.724.724 0 0 1-.723-.724v-9.41Zm2.17-2.17V5.986a.724.724 0 0 1 .725-.723h5.79a.724.724 0 0 1 .724.723v1.448h3.619v1.448H4.918V7.435h3.619Zm1.449-.725v.724h4.342v-.724H9.985Zm0 5.79v4.343h1.447v-4.342H9.985Zm2.895 0v4.343h1.447v-4.342H12.88Z"
    />
    {props?.row && <title>Delete Row</title>}{props?.tab && <title>Delete Tab</title>}{!props?.row && <title>Delete column</title>}
  </svg>
)