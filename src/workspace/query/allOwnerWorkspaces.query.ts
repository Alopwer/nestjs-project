export const allOwnerWorkspacesQuery = `
  SELECT w.workspace_id,
      w.owner_id,
      w.title,
      pf.url as cover_image_url,
      json_strip_nulls(COALESCE(json_agg(json_build_object('user_id', u.user_id, 'username', u.username)) FILTER (WHERE wr.status_code = 'A'), '[]')) coworkers
  FROM workspaces w
  LEFT JOIN workspace_relations wr ON wr.workspace_id = w.workspace_id
  LEFT JOIN users u ON u.user_id = wr.addressee_id
  LEFT JOIN public_files pf ON pf.public_file_id = w.cover_image_id
  WHERE w.owner_id = $1
  GROUP BY w.workspace_id, pf.url
`;
