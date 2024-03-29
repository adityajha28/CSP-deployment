import React, { useState, useEffect } from "react";
import { Button, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from "monday-ui-react-core";
import Api from "../api/Api";
import { useParams } from "react-router-dom";

export default function VersionHistory() {
    const [versions, setVersions] = useState([]);
    const [editedRowIndex, setEditedRowIndex] = useState();
    const { id } = useParams();
    const userRole=localStorage.getItem("userRole");

    const tableHeaders = ['Version', 'Change Type', 'Change Reason', 'Created By', 'Revision Date', 'Approval Date', 'Approved By', 'Action'];

    useEffect(() => {
        fetchVersions();
    }, []);

    const fetchVersions = async () => {
        try {
            const response = await Api.get("/versionhistory");
            setVersions(response.data);
        } catch (error) {
            console.error("Error fetching versions:", error);
        }
    };

    const handleChange = (index, type, value) => {
        const updatedVersions = [...versions];
        updatedVersions[index][type] = value;
        setVersions(updatedVersions);
    };

    const handleSave = async (rowData) => {
        try {
            setEditedRowIndex(-1);
            if (rowData.id) {
                await Api.put(`/versionhistory/${rowData.id}`, rowData);
            } else {
                await Api.post("/versionhistory", rowData);
            }
        
            fetchVersions();
        } catch (error) {
            console.error("Error saving version:", error);
        }
    };

    const handleDelete = async (rowData, index) => {
        if( userRole=="Auditor" || userRole=="Client")
        {
            alert("You don't have permission");
            return
        }
        try {
            const confirmation = window.confirm("Do you really want to delete it?");
            if (confirmation) {
                await Api.delete(`/versionhistory/${rowData.id}`);
                const updatedVersions = [...versions];
                updatedVersions.splice(index, 1);
                setVersions(updatedVersions);
            }
        } catch (error) {
            console.error("Error deleting version:", error);
        }
        setEditedRowIndex(-1);
    };

    const handleEdit = (index) => {
        if( userRole=="Auditor" || userRole=="Client")
        {
            alert("You don't have permission");
            return
        }
        setEditedRowIndex(index);
    };

    const handleAddRow = () => {
        if( userRole=="Auditor" || userRole=="Client")
        {
            alert("You don't have permission");
            return
        }
        setVersions([...versions, {
            id: null,
            version: "",
            changeType: "",
            changeReason: "",
            createdBy: "",
            revisionDate: "",
            approvalDate: "",
            approvedBy: "",
            project: {
                id: id
            }
        }]);
    };

    return (
        <div>
            <DynamicTable
                tableHeaders={tableHeaders}
                versions={versions}
                handleChange={handleChange}
                handleDelete={handleDelete}
                handleAddRow={handleAddRow}
                editedRowIndex={editedRowIndex}
                handleEdit={handleEdit}
                handleSave={handleSave}
                projectId={id}

            />
        </div>
    );
}

const DynamicTable = ({ tableHeaders, versions, handleAddRow, handleChange, handleDelete, editedRowIndex, handleEdit, handleSave ,projectId }) => {
    useEffect(() => {
    }, [VersionHistory])
    
    return (
        <>
            <Button onClick={handleAddRow}  className="w-20" style={{ marginBottom: "8px" }}>Add Row</Button>
            <Table columns={[
                    { id: 'version', title: 'Version' },
                    { id: 'changeType', title: 'Change Type' },
                    { id: 'changeReason', title: 'Change Reason' },
                    { id: 'createdBy', title: 'Created By' },
                    { id: 'revisionDate', title: 'Revision Date' },
                    { id: 'approvalDate', title: 'Approval Date' },
                    { id: 'approvedBy', title: 'Approved By' },
                    { id: 'action', title: 'Action' },
                ]}>
                    <TableHeader>
                        {tableHeaders.map(header => (
                            <TableHeaderCell key={header} title={header} />
                        ))}
                    </TableHeader>
                    <TableBody>
                        {versions.map((row, index) =>
                        row?.project?.id == projectId ? 
                        (
                            <TableRow key={index}>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={row.version}
                                        style={{ "border": "none" }}
                                        onChange={(e) => handleChange(index, "version", e.target.value)}
                                        readOnly={editedRowIndex !== index}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={row.changeType}
                                        style={{ "border": "none" }}
                                        onChange={(e) => handleChange(index, "changeType", e.target.value)}
                                        readOnly={editedRowIndex !== index}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={row.changeReason}
                                        style={{ "border": "none" }}
                                        onChange={(e) => handleChange(index, "changeReason", e.target.value)}
                                        readOnly={editedRowIndex !== index}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={row.createdBy}
                                        style={{ "border": "none" }}
                                        onChange={(e) => handleChange(index, "createdBy", e.target.value)}
                                        readOnly={editedRowIndex !== index}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="date"
                                        value={row.revisionDate}
                                        style={{ "border": "none" }}
                                        onChange={(e) => handleChange(index, "revisionDate", e.target.value)}
                                        readOnly={editedRowIndex !== index}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="date"
                                        value={row.approvalDate}
                                        style={{ "border": "none" }}
                                        onChange={(e) => handleChange(index, "approvalDate", e.target.value)}
                                        readOnly={editedRowIndex !== index}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={row.approvedBy}
                                        style={{ "border": "none" }}
                                        onChange={(e) => handleChange(index, "approvedBy", e.target.value)}
                                        readOnly={editedRowIndex !== index}
                                    />
                                </TableCell>
                                <TableCell>
                                    {editedRowIndex !== index ? (
                                        <>
                                            <button onClick={() => handleEdit(index)}>Edit</button>
                                            <button onClick={() => handleDelete(row, index)}>Delete</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleSave(row)}>Save</button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ):null)}
                    </TableBody>
                </Table>
            </>
            );
};
