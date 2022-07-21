export const allSharedWorkspacesQuery = `
  SELECT w.workspace_id,
    w.title,
    w.owner_id,
    json_strip_nulls(COALESCE(json_agg(json_build_object('user_id', u.user_id, 'username', u.username)) FILTER (
      WHERE wr.status_code = 'A'), '[]')
    ) coworkers
  FROM workspaces w
  INNER JOIN workspace_relations wr USING(workspace_id)
  INNER JOIN users u ON wr.addressee_id = u.user_id
  WHERE workspace_id in
    (SELECT w1.workspace_id
      FROM workspaces w1
      INNER JOIN workspace_relations wr1 ON wr1.workspace_id = w1.workspace_id
      WHERE wr1.addressee_id = $1)
  GROUP BY w.workspace_id
`