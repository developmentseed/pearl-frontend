export function listPageOptions(page, lastPage) {
  let pageOptions = [1];
  if (lastPage === 1) {
    return pageOptions;
  }
  if (page === 0 || page > lastPage) {
    return pageOptions.concat([2, '...', lastPage]);
  }
  if (lastPage > 5) {
    if (page < 3) {
      return pageOptions.concat([2, 3, '...', lastPage]);
    }
    if (page === 3) {
      return pageOptions.concat([2, 3, 4, '...', lastPage]);
    }
    if (page === lastPage) {
      return pageOptions.concat(['...', page - 2, page - 1, lastPage]);
    }
    if (page === lastPage - 1) {
      return pageOptions.concat(['...', page - 1, page, lastPage]);
    }
    if (page === lastPage - 2) {
      return pageOptions.concat(['...', page - 1, page, page + 1, lastPage]);
    }
    return pageOptions.concat([
      '...',
      page - 1,
      page,
      page + 1,
      '...',
      lastPage,
    ]);
  } else {
    let range = [];
    for (let i = 1; i <= lastPage; i++) {
      range.push(i);
    }
    return range;
  }
}
