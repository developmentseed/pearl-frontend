import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { StyledNavLink } from '../../../styles/links';
import { useAuth } from '../../../context/auth';
import App from '../../common/app';
import { FormSwitch } from '@devseed-ui/form';
import PageHeader from '../../common/page-header';
import Paginator from '../../common/paginator';
import { PageBody } from '../../../styles/page';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../common/global-loading';
import Table, { TableRow, TableCell } from '../../common/table';
import logger from '../../../utils/logger';
import { Link } from 'react-router-dom';

// Controls the size of each page
const ITEMS_PER_PAGE = 10;

const HEADERS = ['Id', 'Username', 'E-mail', 'Admin'];

export const UsersBody = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto 1fr;
  grid-gap: ${glsp()};
  padding-top: 0;
`;

export const UsersHeadline = styled(InpageHeadline)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

// Render single users row
function renderRow(user) {
  return (
    <TableRow key={user.id}>
      <TableCell>{user.id}</TableCell>
      <TableCell>
        <StyledNavLink to={`/admin/users/${user.id}`}>
          {user.username}
        </StyledNavLink>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <FormSwitch
          data-cy='user-admin-checkbox'
          hideText
          checked={user.access === 'admin'}
        />
      </TableCell>
    </TableRow>
  );
}

export default function UserIndex() {
  const { apiToken } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);

  const { restApiClient } = useAuth();

  async function fetchUsers() {
    if (apiToken) {
      try {
        showGlobalLoadingMessage('Loading users...');
        const data = await restApiClient.get(
          `user/?page=${page - 1}&limit=${ITEMS_PER_PAGE}`
        );
        setTotal(data.total);
        setUsers(data.users);
      } catch (error) {
        logger(error);
      } finally {
        hideGlobalLoading();
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [apiToken, page]);

  return (
    <App pageTitle='Users'>
      <PageHeader />
      <PageBody role='main'>
        <Inpage>
          <InpageHeader>
            <InpageHeaderInner>
              <UsersHeadline>
                <InpageTitle>
                  <Link to='/admin/users'>Users</Link>
                </InpageTitle>
              </UsersHeadline>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <UsersBody>
              {users &&
                (users.length ? (
                  <>
                    <Table
                      headers={HEADERS}
                      data={users}
                      renderRow={(m) => renderRow(m)}
                      hoverable
                    />
                    <Paginator
                      currentPage={page}
                      gotoPage={setPage}
                      totalItems={total}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />
                  </>
                ) : (
                  <Heading>
                    {isLoading ? 'Loading Users...' : 'No users found.'}
                  </Heading>
                ))}
            </UsersBody>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
