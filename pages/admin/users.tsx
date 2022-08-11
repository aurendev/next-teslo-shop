import { PeopleOutlined } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { tesloApi } from "../../api";
import { AdminLayout } from "../../components/layouts";
import { IUser } from "../../interfaces";

const UsersPage = () => {

  const {data, error} = useSWR<IUser[]>("/api/admin/users");

  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data])
  

  if(!data && !error) return (<></>)

  const columns : GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250},
    { field: 'name', headerName: 'Nombre completo', width: 300},
    { field: 'role', headerName: 'Rol', width: 300,
  
    renderCell: ({row}: GridValueGetterParams)=> {
      return(
        <Select
          value={row.role}
          label="Rol"
          onChange={(e)=> onRoleUpdated(row.id, e.target.value)}
          sx={{width: '300px'}}
        >
          <MenuItem value='admin'>Administrador</MenuItem>
          <MenuItem value='super-user'>Super usuario</MenuItem>
          <MenuItem value='SEO' >SEO</MenuItem>
          <MenuItem value='client'>Cliente</MenuItem>

        </Select>
      )
    }
  },
  ]

  const rows = users.map((user, index) => ({
    id:user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  const onRoleUpdated = async (userId: string, role: string) => {

    const previousUsers = [...users];

    const updatedUser = previousUsers.map(user => ({
      ...user,
      role: user._id === userId ? role : user.role
    }));

    setUsers(updatedUser);

    try {
      const { data} = await tesloApi.put('/admin/users', {userId, role})
      console.log('[Users update]',data);
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert('no se pudo cambia r el rol')
    }
  }

	return (
		<AdminLayout
			title={"Usuarios"}
			subtitle={"Mantenimiento de usuarios"}
			icon={<PeopleOutlined />}
		>
			<Grid container sx={{mt:2}}>
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid
						columns={columns}
						rows={rows}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};


export default UsersPage;
