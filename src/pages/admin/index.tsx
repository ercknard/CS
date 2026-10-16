import * as React from 'react';

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

import AdminAuthGuard from '@/components/AdminAuthGuard';
import supabase from '@/lib/supabase';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

type JsonRecord = Record<string, unknown>;

type FormFieldType = 'text' | 'number' | 'boolean' | 'json';

type AdminTable = {
  name: string;
  label: string;
  description: string;
  primaryKey: string;
  icon: React.ReactNode;
  accent: string;
  category: string;
};

type EditorState = {
  mode: 'create' | 'edit';
  record: JsonRecord;
};

type EditHistoryEntry = {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  recordId: string;
  timestamp: string;
};

const ADMIN_TABLES: AdminTable[] = [
  {
    name: 'sc_home_sections',
    label: 'Home Section',
    description:
      'Manage homepage hero content, headlines, and call-to-action buttons.',
    primaryKey: 'id',
    icon: <HomeRoundedIcon />,
    accent: '#7C4DFF',
    category: 'People'
  },
  {
    name: 'sc_team_members',
    label: 'Team Members',
    description: 'Administrators, team members, and moderators.',
    primaryKey: 'id',
    icon: <PeopleAltRoundedIcon />,
    accent: '#A78BFA',
    category: 'People'
  },
  {
    name: 'sc_services',
    label: 'Services',
    description: 'Services displayed throughout your website.',
    primaryKey: 'id',
    icon: <DesignServicesRoundedIcon />,
    accent: '#38BDF8',
    category: 'Business'
  },
  {
    name: 'sc_security_tiers',
    label: 'Security Tiers',
    description: 'Security packages and service tiers.',
    primaryKey: 'id',
    icon: <ShieldRoundedIcon />,
    accent: '#FB7185',
    category: 'Security'
  },
  {
    name: 'sc_security_capabilities',
    label: 'Security Capabilities',
    description: 'Security features and capabilities.',
    primaryKey: 'id',
    icon: <SecurityRoundedIcon />,
    accent: '#F472B6',
    category: 'Security'
  },
  {
    name: 'sc_security_notes',
    label: 'Security Notes',
    description: 'Security-related information and notes.',
    primaryKey: 'id',
    icon: <TerminalRoundedIcon />,
    accent: '#FBBF24',
    category: 'Security'
  },
  {
    name: 'ztable_otherprojects',
    label: 'Other Projects',
    description: 'Additional projects, references, and links.',
    primaryKey: 'id',
    icon: <FolderSpecialRoundedIcon />,
    accent: '#34D399',
    category: 'Portfolio'
  },
  {
    name: 'sc_game_servers',
    label: 'Game Servers',
    description: 'Minecraft, Project Zomboid, and Luanti servers.',
    primaryKey: 'id',
    icon: <SportsEsportsRoundedIcon />,
    accent: '#2DD4BF',
    category: 'Gaming'
  },
  {
    name: 'sc_faqs',
    label: 'FAQs',
    description: 'Frequently asked questions and answers.',
    primaryKey: 'id',
    icon: <QuizRoundedIcon />,
    accent: '#60A5FA',
    category: 'Content'
  },
  {
    name: 'sc_projects',
    label: 'Projects',
    description: 'Featured projects displayed on your website.',
    primaryKey: 'id',
    icon: <AutoAwesomeRoundedIcon />,
    accent: '#C084FC',
    category: 'Portfolio'
  },
  {
    name: 'services',
    label: 'Public Services',
    description: 'Records in your public services table.',
    primaryKey: 'id',
    icon: <LayersRoundedIcon />,
    accent: '#FB923C',
    category: 'Business'
  }
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  }

  return String(value);
}

function getDisplayColumns(rows: JsonRecord[]): string[] {
  const columns = new Set<string>();

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => columns.add(key));
  });

  return Array.from(columns);
}

function getFormFieldType(value: unknown): FormFieldType {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';

  if (typeof value === 'object' && value !== null) {
    return 'json';
  }

  return 'text';
}

function getFormFieldValue(value: unknown, fieldType: FormFieldType): unknown {
  if (fieldType === 'json') {
    if (value === null || value === undefined || value === '') return '';

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '';
    }
  }

  if (fieldType === 'boolean') {
    return value === true;
  }

  if (value === null || value === undefined) return '';

  return String(value);
}

function getInitialFormRecord(
  rows: JsonRecord[],
  mode: EditorState['mode'],
  primaryKey: string
): {
  record: JsonRecord;
  fieldTypes: Record<string, FormFieldType>;
} {
  const record: JsonRecord = {};
  const fieldTypes: Record<string, FormFieldType> = {};

  if (mode === 'edit' || rows.length === 0) {
    return { record, fieldTypes };
  }

  const firstRow = rows[0];

  Object.entries(firstRow).forEach(([key, value]) => {
    // Let the database generate the primary key for new records.
    if (key === primaryKey) return;

    const fieldType = getFormFieldType(value);

    fieldTypes[key] = fieldType;
    record[key] =
      fieldType === 'boolean' ? false : fieldType === 'json' ? '' : '';
  });

  return { record, fieldTypes };
}

function AdminStat({
  label,
  value,
  caption,
  icon,
  accent,
  loading
}: {
  label: string;
  value: string | number;
  caption: string;
  icon: React.ReactNode;
  accent: string;
  loading?: boolean;
}) {
  const theme = useTheme();
  const customTheme = theme;

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        p: { xs: 2, sm: 2.5 },
        minWidth: 0,
        borderRadius: 4,
        borderColor: 'divider',
        bgcolor: customTheme.secondaryScale?.[4],
        transition:
          'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: alpha(accent, 0.6),
          boxShadow: `0 14px 38px ${alpha(accent, 0.09)}`
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          right: -45,
          top: -45,
          background: alpha(
            accent,
            theme.palette.mode === 'dark' ? 0.13 : 0.08
          ),
          pointerEvents: 'none'
        }
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}
        spacing={2}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {label}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              mt: 1.5,
              fontWeight: 900,
              letterSpacing: '-0.065em',
              lineHeight: 1.1
            }}
          >
            {loading ? '—' : value}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1.25 }}
          >
            {caption}
          </Typography>
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            width: 48,
            height: 48,
            flexShrink: 0,
            color: accent,
            bgcolor: alpha(accent, 0.13),
            border: `1px solid ${alpha(accent, 0.24)}`,
            borderRadius: 3
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const theme = useTheme();
  const accent = theme.colorScale?.[9] ?? theme.palette.primary.main;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="overline"
        sx={{
          fontWeight: 900,
          letterSpacing: '0.16em',
          color: accent
        }}
      >
        {eyebrow}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          mt: 0.25,
          fontWeight: 900,
          letterSpacing: '-0.045em'
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  );
}

function AdminDashboard() {
  const theme = useTheme();
  const customTheme = theme;

  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';

  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true
  });

  const primary = theme.colorScale?.[9] ?? theme.palette.primary.main;
  const secondary = theme.secondaryScale?.[9] ?? theme.palette.secondary.main;
  const headingColor = theme.grayScale?.[12] ?? theme.palette.text.primary;
  const mutedColor = theme.grayScale?.[10] ?? theme.palette.text.secondary;

  const [activeTableName, setActiveTableName] = React.useState(
    ADMIN_TABLES[0].name
  );
  const [activeView, setActiveView] = React.useState<'overview' | 'table'>(
    'overview'
  );

  const [rows, setRows] = React.useState<JsonRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [tableFilter, setTableFilter] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [editor, setEditor] = React.useState<EditorState | null>(null);
  const [editorError, setEditorError] = React.useState('');
  const [fieldTypes, setFieldTypes] = React.useState<
    Record<string, FormFieldType>
  >({});
  const [newFieldName, setNewFieldName] = React.useState('');
  const [newFieldType, setNewFieldType] = React.useState<FormFieldType>('text');

  const [deleteTarget, setDeleteTarget] = React.useState<JsonRecord | null>(
    null
  );

  // Edit history for the current page session.
  const [editHistory, setEditHistory] = React.useState<EditHistoryEntry[]>([]);

  const addHistoryEntry = (
    action: EditHistoryEntry['action'],
    table: string,
    recordId: unknown
  ) => {
    setEditHistory((previous) =>
      [
        {
          id: `${Date.now()}-${Math.random()}`,
          action,
          table,
          recordId: formatValue(recordId),
          timestamp: new Date().toISOString()
        },
        ...previous
      ].slice(0, 50)
    );
  };

  const activeTable =
    ADMIN_TABLES.find((table) => table.name === activeTableName) ??
    ADMIN_TABLES[0];

  const gradient = `linear-gradient(135deg, ${primary}, ${secondary})`;

  const filteredTables = React.useMemo(() => {
    const query = tableFilter.trim().toLowerCase();

    if (!query) return ADMIN_TABLES;

    return ADMIN_TABLES.filter((table) =>
      `${table.label} ${table.name} ${table.category}`
        .toLowerCase()
        .includes(query)
    );
  }, [tableFilter]);

  const loadRows = React.useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from(activeTable.name)
        .select('*')
        .limit(1000);

      if (queryError) throw queryError;

      setRows((data ?? []) as JsonRecord[]);
      setPage(0);
    } catch (caught) {
      setRows([]);
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to load records from Supabase.'
      );
    } finally {
      setLoading(false);
    }
  }, [activeTable.name]);

  React.useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        formatValue(value).toLowerCase().includes(query)
      )
    );
  }, [rows, search]);

  const columns = React.useMemo(
    () => getDisplayColumns(filteredRows),
    [filteredRows]
  );

  const paginatedRows = filteredRows.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const changeTable = (tableName: string) => {
    setActiveTableName(tableName);
    setActiveView('table');
    setSearch('');
    setPage(0);
    setError('');
    setNotice('');
    setEditor(null);
    setEditorError('');
    setFieldTypes({});
    setNewFieldName('');
    setDeleteTarget(null);
    setSidebarOpen(false);
  };

  const openOverview = () => {
    setActiveView('overview');
    setSearch('');
    setError('');
    setNotice('');
    setSidebarOpen(false);
  };

  const openCreateDialog = () => {
    const initial = getInitialFormRecord(
      rows,
      'create',
      activeTable.primaryKey
    );

    setEditor({ mode: 'create', record: initial.record });
    setFieldTypes(initial.fieldTypes);
    setNewFieldName('');
    setNewFieldType('text');
    setEditorError('');
    setError('');
    setNotice('');
  };

  const openEditDialog = (record: JsonRecord) => {
    const recordForForm: JsonRecord = {};
    const types: Record<string, FormFieldType> = {};

    Object.entries(record).forEach(([key, value]) => {
      const type = getFormFieldType(value);

      types[key] = type;
      recordForForm[key] = getFormFieldValue(value, type);
    });

    setEditor({ mode: 'edit', record: recordForForm });
    setFieldTypes(types);
    setNewFieldName('');
    setNewFieldType('text');
    setEditorError('');
    setError('');
    setNotice('');
  };

  const closeEditor = () => {
    if (saving) return;

    setEditor(null);
    setEditorError('');
    setFieldTypes({});
    setNewFieldName('');
  };

  const updateEditorField = (key: string, value: unknown) => {
    setEditor((current) => {
      if (!current) return current;

      return {
        ...current,
        record: {
          ...current.record,
          [key]: value
        }
      };
    });
  };

  const addEditorField = () => {
    if (!editor) return;

    const key = newFieldName.trim();

    if (!key) {
      setEditorError('Enter a column name before adding a field.');
      return;
    }

    if (Object.prototype.hasOwnProperty.call(editor.record, key)) {
      setEditorError(`The field "${key}" already exists.`);
      return;
    }

    if (key === activeTable.primaryKey && editor.mode === 'edit') {
      setEditorError('The primary key cannot be added as an editable field.');
      return;
    }

    let initialValue: unknown = '';

    if (newFieldType === 'boolean') {
      initialValue = false;
    }

    if (newFieldType === 'json') {
      initialValue = '';
    }

    setEditor((current) => {
      if (!current) return current;

      return {
        ...current,
        record: {
          ...current.record,
          [key]: initialValue
        }
      };
    });

    setFieldTypes((current) => ({
      ...current,
      [key]: newFieldType
    }));

    setNewFieldName('');
    setNewFieldType('text');
    setEditorError('');
  };

  const saveRecord = async () => {
    if (!editor || saving) return;

    setEditorError('');
    setError('');
    setNotice('');

    const parsedRecord: JsonRecord = {};

    try {
      for (const [key, rawValue] of Object.entries(editor.record)) {
        const fieldType = fieldTypes[key] ?? 'text';

        // The primary key is shown as read-only when editing.
        if (editor.mode === 'edit' && key === activeTable.primaryKey) {
          continue;
        }

        if (fieldType === 'boolean') {
          parsedRecord[key] = rawValue === true;
          continue;
        }

        if (fieldType === 'number') {
          if (rawValue === '' || rawValue === null || rawValue === undefined) {
            parsedRecord[key] = null;
          } else {
            const numericValue = Number(rawValue);

            if (!Number.isFinite(numericValue)) {
              throw new Error(`"${key}" must be a valid number.`);
            }

            parsedRecord[key] = numericValue;
          }

          continue;
        }

        if (fieldType === 'json') {
          if (rawValue === '' || rawValue === null || rawValue === undefined) {
            parsedRecord[key] = null;
          } else if (typeof rawValue !== 'string') {
            parsedRecord[key] = rawValue;
          } else {
            try {
              parsedRecord[key] = JSON.parse(rawValue) as unknown;
            } catch {
              throw new Error(
                `"${key}" must contain valid JSON. Check its syntax.`
              );
            }
          }

          continue;
        }

        parsedRecord[key] = rawValue === undefined ? null : rawValue;
      }
    } catch (caught) {
      setEditorError(
        caught instanceof Error ? caught.message : 'Check the form values.'
      );
      return;
    }

    if (Object.keys(parsedRecord).length === 0) {
      setEditorError(
        'Add at least one editable field. Required fields depend on your table schema.'
      );
      return;
    }

    setSaving(true);

    try {
      if (editor.mode === 'create') {
        const { error: insertError } = await supabase
          .from(activeTable.name)
          .insert(parsedRecord);

        if (insertError) throw insertError;

        addHistoryEntry(
          'CREATE',
          activeTable.name,
          parsedRecord[activeTable.primaryKey] ?? 'New record'
        );

        setEditor(null);
        setNotice('Record created successfully.');
      } else {
        const primaryKeyValue = editor.record[activeTable.primaryKey];

        if (primaryKeyValue === null || primaryKeyValue === undefined) {
          throw new Error(
            `Cannot update this record: primary key "${activeTable.primaryKey}" was not found.`
          );
        }

        if (Object.keys(parsedRecord).length === 0) {
          throw new Error('No editable fields were provided.');
        }

        const { error: updateError } = await supabase
          .from(activeTable.name)
          .update(parsedRecord)
          .eq(activeTable.primaryKey, primaryKeyValue);

        if (updateError) throw updateError;

        addHistoryEntry(
          'UPDATE',
          activeTable.name,
          editor.record[activeTable.primaryKey]
        );

        setEditor(null);
        setNotice('Record updated successfully.');
      }

      setFieldTypes({});
      setNewFieldName('');
      await loadRows();
    } catch (caught) {
      setEditorError(
        caught instanceof Error ? caught.message : 'Unable to save the record.'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async () => {
    if (!deleteTarget || saving) return;

    const primaryKeyValue = deleteTarget[activeTable.primaryKey];

    if (primaryKeyValue === null || primaryKeyValue === undefined) {
      setError(
        `Cannot delete this record: primary key "${activeTable.primaryKey}" was not found.`
      );
      setDeleteTarget(null);
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const { error: deleteError } = await supabase
        .from(activeTable.name)
        .delete()
        .eq(activeTable.primaryKey, primaryKeyValue);

      if (deleteError) throw deleteError;

      addHistoryEntry('DELETE', activeTable.name, primaryKeyValue);

      setDeleteTarget(null);
      setNotice('Record deleted successfully.');

      await loadRows();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to delete the record.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);
    setError('');

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      await router.replace('/login');
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Unable to sign out.'
      );
    } finally {
      setSigningOut(false);
    }
  };

  const sidebar = (
    <Stack spacing={2.5}>
      <Box>
        <Typography
          variant="overline"
          sx={{
            px: 1.5,
            color: 'text.secondary',
            fontWeight: 900,
            letterSpacing: '0.14em'
          }}
        >
          Workspace
        </Typography>

        <Button
          fullWidth
          startIcon={<DashboardRoundedIcon />}
          onClick={openOverview}
          sx={{
            mt: 1,
            px: 1.5,
            py: 1.25,
            justifyContent: 'flex-start',
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: activeView === 'overview' ? 800 : 600,
            color: activeView === 'overview' ? primary : 'text.secondary',
            bgcolor:
              activeView === 'overview' ? alpha(primary, 0.12) : 'transparent',
            '&:hover': { bgcolor: alpha(primary, 0.09) }
          }}
        >
          Dashboard overview
        </Button>
      </Box>

      <Divider />

      <Box>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            mb: 1
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontWeight: 900,
              letterSpacing: '0.14em'
            }}
          >
            Database
          </Typography>

          <Chip
            label={ADMIN_TABLES.length}
            size="small"
            sx={{
              height: 23,
              fontWeight: 800,
              color: primary,
              bgcolor: alpha(primary, 0.12)
            }}
          />
        </Stack>

        <TextField
          fullWidth
          size="small"
          placeholder="Find a table..."
          value={tableFilter}
          onChange={(event) => setTableFilter(event.target.value)}
          sx={{
            mb: 1.25,
            '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: tableFilter ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Clear table search"
                    onClick={() => setTableFilter('')}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined
            }
          }}
        />

        <Stack spacing={0.5}>
          {filteredTables.map((table) => {
            const selected =
              activeView === 'table' && table.name === activeTableName;

            return (
              <Button
                key={table.name}
                fullWidth
                onClick={() => changeTable(table.name)}
                startIcon={
                  <Box
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      color: table.accent,
                      '& svg': { fontSize: 19 }
                    }}
                  >
                    {table.icon}
                  </Box>
                }
                endIcon={
                  selected ? (
                    <ChevronRightRoundedIcon sx={{ fontSize: 19 }} />
                  ) : undefined
                }
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  px: 1.5,
                  py: 1.15,
                  minHeight: 43,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontSize: '0.84rem',
                  fontWeight: selected ? 800 : 550,
                  color: selected ? headingColor : 'text.secondary',
                  bgcolor: selected ? alpha(table.accent, 0.12) : 'transparent',
                  border: '1px solid',
                  borderColor: selected
                    ? alpha(table.accent, 0.25)
                    : 'transparent',
                  '& .MuiButton-startIcon': { mr: 1.25 },
                  '& .MuiButton-endIcon': { ml: 'auto' },
                  '&:hover': { bgcolor: alpha(table.accent, 0.09) }
                }}
              >
                <Box
                  component="span"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {table.label}
                </Box>
              </Button>
            );
          })}

          {filteredTables.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 1.5 }}>
              No matching tables.
            </Typography>
          )}
        </Stack>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 3,
          borderColor: alpha(secondary, 0.25),
          background: `linear-gradient(145deg, ${alpha(primary, 0.09)}, ${alpha(secondary, 0.07)})`
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.25}>
          <Avatar
            variant="rounded"
            sx={{
              width: 38,
              height: 38,
              color: secondary,
              bgcolor: alpha(secondary, 0.13),
              borderRadius: 2.5
            }}
          >
            <ShieldRoundedIcon fontSize="small" />
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 850 }}>
              Protected workspace
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator access
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: headingColor,
        backgroundImage: isDark
          ? `radial-gradient(ellipse at 10% 0%, ${alpha(primary, 0.08)}, transparent 35%), radial-gradient(ellipse at 100% 25%, ${alpha(secondary, 0.06)}, transparent 35%)`
          : `radial-gradient(ellipse at 10% 0%, ${alpha(primary, 0.055)}, transparent 35%), radial-gradient(ellipse at 100% 25%, ${alpha(secondary, 0.045)}, transparent 35%)`
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: alpha(customTheme.secondaryScale?.[4], isDark ? 1 : 0.75),
          backdropFilter: 'blur(22px)',
          zIndex: theme.zIndex.appBar
        }}
      >
        <Toolbar
          sx={{
            minHeight: '72px !important',
            px: { xs: 2, md: 3.5 },
            gap: 1.5
          }}
        >
          {isMobile && (
            <IconButton
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 0.25 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}

          <Avatar
            variant="rounded"
            sx={{
              width: 43,
              height: 43,
              color: '#fff',
              background: gradient,
              borderRadius: 2.75,
              boxShadow: `0 6px 20px ${alpha(primary, 0.24)}`
            }}
          >
            <CodeRoundedIcon />
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 950,
                fontSize: '0.96rem',
                letterSpacing: '-0.045em',
                lineHeight: 1.2
              }}
            >
              CRYPTECH
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Services · Control Center
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Chip
            icon={<CheckCircleRoundedIcon />}
            label="Supabase"
            size="small"
            variant="outlined"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              height: 30,
              borderColor: alpha('#34D399', 0.4),
              color: 'text.secondary',
              '& .MuiChip-icon': { color: '#34D399' }
            }}
          />

          <Tooltip title="Refresh current table">
            <span>
              <IconButton
                aria-label="Refresh current table"
                onClick={() => void loadRows()}
                disabled={loading || saving}
              >
                <RefreshRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Sign out">
            <span>
              <IconButton
                aria-label="Sign out"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
              >
                {signingOut ? (
                  <CircularProgress size={20} />
                ) : (
                  <LogoutRoundedIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Dialog
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          fullWidth
          maxWidth="xs"
          fullScreen={false}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 4,
                p: 1
              }
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            Navigation
            <IconButton
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
            >
              <CloseRoundedIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>{sidebar}</DialogContent>
        </Dialog>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '250px minmax(0, 1fr)' },
          minHeight: 'calc(100vh - 72px)'
        }}
      >
        {!isMobile && (
          <Box
            component="aside"
            sx={{
              bgcolor: alpha(
                customTheme.secondaryScale?.[4],
                isDark ? 1 : 0.75
              ),
              borderRight: 1,
              borderColor: 'divider',
              p: 2,
              minWidth: 0
            }}
          >
            {sidebar}
          </Box>
        )}

        <Box
          component="main"
          sx={{
            minWidth: 0,
            p: { xs: 2, sm: 3, lg: 4 }
          }}
        >
          <Container maxWidth={false} disableGutters>
            <Stack spacing={2.5} sx={{ mb: 3 }}>
              <Stack
                direction="row"
                sx={{ alignItems: 'center', color: 'text.secondary' }}
                spacing={1}
              >
                <StorageRoundedIcon sx={{ fontSize: 17 }} />
                <Typography variant="caption">Admin</Typography>
                <ChevronRightRoundedIcon sx={{ fontSize: 15 }} />
                <Typography
                  variant="caption"
                  sx={{ color: primary, fontWeight: 800 }}
                >
                  {activeView === 'overview' ? 'Overview' : activeTable.label}
                </Typography>
              </Stack>

              {activeView === 'overview' ? (
                <Paper
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    p: { xs: 2.5, sm: 4, lg: 5 },
                    borderRadius: { xs: 3, md: 4 },
                    color: '#fff',
                    background: `linear-gradient(115deg, ${primary} 0%, ${secondary} 55%, #8B5CF6 100%)`,
                    boxShadow: `0 18px 50px ${alpha(primary, 0.2)}`
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 320,
                      height: 320,
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      right: { xs: -180, md: -60 },
                      top: -145,
                      pointerEvents: 'none',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 24,
                        border: '1px solid rgba(255,255,255,0.17)',
                        borderRadius: '50%'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 55,
                        border: '1px solid rgba(255,255,255,0.14)',
                        borderRadius: '50%'
                      }
                    }}
                  />

                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', mb: 2, position: 'relative' }}
                    spacing={1}
                  >
                    <AutoAwesomeRoundedIcon />
                    <Typography
                      variant="overline"
                      sx={{ fontWeight: 900, letterSpacing: '0.16em' }}
                    >
                      CONTROL CENTER
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h3"
                    sx={{
                      position: 'relative',
                      fontWeight: 950,
                      letterSpacing: '-0.065em',
                      lineHeight: 1.08,
                      fontSize: { xs: '2rem', sm: '2.7rem', lg: '3.25rem' },
                      maxWidth: 650
                    }}
                  >
                    Your workspace.
                    <br />
                    Your command.
                  </Typography>

                  <Typography
                    sx={{
                      position: 'relative',
                      mt: 2,
                      maxWidth: 550,
                      color: 'rgba(255,255,255,0.84)',
                      lineHeight: 1.8
                    }}
                  >
                    Manage your Cryptech Services website content, security
                    offerings, projects, team members, and game servers from one
                    place.
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    sx={{ mt: 3, position: 'relative' }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => changeTable(ADMIN_TABLES[0].name)}
                      endIcon={<ArrowOutwardRoundedIcon />}
                      sx={{
                        px: 2.25,
                        py: 1.2,
                        borderRadius: 2.5,
                        color: primary,
                        bgcolor: '#fff',
                        fontWeight: 850,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#F3F4F6' }
                      }}
                    >
                      Manage team
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => changeTable('sc_projects')}
                      sx={{
                        px: 2.25,
                        py: 1.2,
                        borderRadius: 2.5,
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.45)',
                        fontWeight: 750,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#fff',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Browse projects
                    </Button>
                  </Stack>
                </Paper>
              ) : (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    alignItems: { xs: 'stretch', sm: 'flex-end' },
                    justifyContent: 'space-between'
                  }}
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 950,
                        letterSpacing: '-0.06em',
                        lineHeight: 1.15
                      }}
                    >
                      {activeTable.label}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1, maxWidth: 620 }}
                    >
                      {activeTable.description}
                    </Typography>

                    <Chip
                      icon={<StorageRoundedIcon />}
                      label={`public.${activeTable.name}`}
                      size="small"
                      sx={{
                        mt: 1.5,
                        maxWidth: '100%',
                        bgcolor: alpha(activeTable.accent, 0.1),
                        color: activeTable.accent,
                        fontFamily: 'monospace',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddRoundedIcon />}
                    onClick={openCreateDialog}
                    disabled={loading || saving}
                    sx={{
                      flexShrink: 0,
                      alignSelf: { xs: 'flex-start', sm: 'auto' },
                      borderRadius: 2.5,
                      px: 2.5,
                      py: 1.25,
                      textTransform: 'none',
                      fontWeight: 850,
                      background: gradient,
                      boxShadow: `0 7px 22px ${alpha(primary, 0.22)}`,
                      '&:hover': {
                        background: gradient,
                        boxShadow: `0 9px 26px ${alpha(primary, 0.32)}`
                      }
                    }}
                  >
                    New record
                  </Button>
                </Stack>
              )}
            </Stack>

            {error && (
              <Alert
                severity="error"
                icon={<ErrorOutlineRoundedIcon />}
                onClose={() => setError('')}
                sx={{ mb: 3, borderRadius: 2.5 }}
              >
                {error}
              </Alert>
            )}

            {notice && (
              <Alert
                severity="success"
                onClose={() => setNotice('')}
                sx={{ mb: 3, borderRadius: 2.5 }}
              >
                {notice}
              </Alert>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(3, minmax(0, 1fr))'
                },
                gap: 2,
                mb: 4
              }}
            >
              <AdminStat
                label="Loaded records"
                value={rows.length}
                caption="Current table · up to 1,000"
                icon={<QueryStatsRoundedIcon />}
                accent="#38BDF8"
                loading={loading}
              />

              <AdminStat
                label="Search results"
                value={filteredRows.length}
                caption={search ? 'Matching your search' : 'All loaded records'}
                icon={<SearchRoundedIcon />}
                accent="#A78BFA"
                loading={loading}
              />

              <AdminStat
                label="Managed tables"
                value={ADMIN_TABLES.length}
                caption="Available database tables"
                icon={<StorageRoundedIcon />}
                accent="#34D399"
              />
            </Box>

            {activeView === 'overview' ? (
              <Stack spacing={4}>
                <Box>
                  <SectionHeading
                    eyebrow="YOUR CONTENT"
                    title="Explore your workspace"
                    description="Choose a database collection to view, create, update, or delete its records."
                  />

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(3, minmax(0, 1fr))'
                      },
                      gap: 2
                    }}
                  >
                    {ADMIN_TABLES.map((table) => (
                      <Paper
                        key={table.name}
                        variant="outlined"
                        onClick={() => changeTable(table.name)}
                        sx={{
                          p: 2.5,
                          bgcolor: alpha(
                            customTheme.secondaryScale?.[4],
                            isDark ? 1 : 0.75
                          ),
                          minWidth: 0,
                          borderRadius: 3.5,
                          cursor: 'pointer',
                          borderColor: 'divider',
                          position: 'relative',
                          overflow: 'hidden',
                          transition:
                            'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            borderColor: alpha(table.accent, 0.65),
                            boxShadow: `0 14px 34px ${alpha(table.accent, 0.11)}`
                          },
                          '&:focus-visible': {
                            outline: `2px solid ${table.accent}`,
                            outlineOffset: 3
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            changeTable(table.name);
                          }
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            alignItems: 'flex-start',
                            justifyContent: 'space-between'
                          }}
                          spacing={2}
                        >
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 48,
                              height: 48,
                              color: table.accent,
                              bgcolor: alpha(table.accent, 0.13),
                              border: `1px solid ${alpha(table.accent, 0.22)}`,
                              borderRadius: 3
                            }}
                          >
                            {table.icon}
                          </Avatar>

                          <ArrowOutwardRoundedIcon
                            sx={{ color: 'text.disabled', fontSize: 20 }}
                          />
                        </Stack>

                        <Chip
                          label={table.category}
                          size="small"
                          sx={{
                            mt: 2,
                            height: 23,
                            bgcolor: alpha(table.accent, 0.1),
                            color: table.accent,
                            fontWeight: 800,
                            fontSize: '0.69rem'
                          }}
                        />

                        <Typography
                          variant="h6"
                          sx={{
                            mt: 1.25,
                            fontWeight: 850,
                            letterSpacing: '-0.035em'
                          }}
                        >
                          {table.label}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.75,
                            lineHeight: 1.7,
                            minHeight: 48
                          }}
                        >
                          {table.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Stack
                          direction="row"
                          sx={{
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontFamily: 'monospace',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              minWidth: 0
                            }}
                          >
                            {table.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: table.accent,
                              fontWeight: 850,
                              flexShrink: 0,
                              ml: 1
                            }}
                          >
                            Open
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Box>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3.5,
                    borderColor: 'divider'
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between'
                    }}
                    spacing={2}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center' }}
                      spacing={1.5}
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: alpha('#34D399', 0.13),
                          color: '#34D399',
                          borderRadius: 2.5
                        }}
                      >
                        <CheckCircleRoundedIcon />
                      </Avatar>

                      <Box>
                        <Typography sx={{ fontWeight: 850 }}>
                          Database workspace ready
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          The current collection is {activeTable.label}.
                        </Typography>
                      </Box>
                    </Stack>

                    <Button
                      variant="outlined"
                      startIcon={<RefreshRoundedIcon />}
                      onClick={() => void loadRows()}
                      disabled={loading || saving}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 750
                      }}
                    >
                      Refresh data
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  overflow: 'hidden',
                  borderRadius: 3.5,
                  bgcolor: customTheme.secondaryScale?.[4],
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{
                      alignItems: { xs: 'stretch', md: 'center' },
                      justifyContent: 'space-between'
                    }}
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        Records
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Browse, search, and manage database entries.
                      </Typography>
                    </Box>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.25}
                      sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                      <TextField
                        select
                        size="small"
                        label="Table"
                        value={activeTableName}
                        onChange={(event) => changeTable(event.target.value)}
                        sx={{
                          minWidth: { sm: 180 },
                          '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                        }}
                      >
                        {ADMIN_TABLES.map((table) => (
                          <MenuItem key={table.name} value={table.name}>
                            {table.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        size="small"
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          setPage(0);
                        }}
                        placeholder="Search records..."
                        sx={{
                          minWidth: { sm: 230 },
                          '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchRoundedIcon
                                  fontSize="small"
                                  color="action"
                                />
                              </InputAdornment>
                            ),
                            endAdornment: search ? (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  aria-label="Clear search"
                                  onClick={() => {
                                    setSearch('');
                                    setPage(0);
                                  }}
                                >
                                  <CloseRoundedIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ) : undefined
                          }
                        }}
                      />

                      <Tooltip title="Refresh data">
                        <span>
                          <IconButton
                            aria-label="Refresh data"
                            onClick={() => void loadRows()}
                            disabled={loading || saving}
                            sx={{
                              alignSelf: { xs: 'flex-start', sm: 'center' },
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 2.5,
                              width: 40,
                              height: 40
                            }}
                          >
                            <RefreshRoundedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                {loading ? (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 10
                    }}
                    spacing={2}
                  >
                    <CircularProgress size={34} sx={{ color: primary }} />
                    <Typography variant="body2" color="text.secondary">
                      Loading database records...
                    </Typography>
                  </Stack>
                ) : columns.length === 0 ? (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: { xs: 7, md: 10 },
                      px: 3
                    }}
                    spacing={2}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 66,
                        height: 66,
                        bgcolor: alpha(activeTable.accent, 0.13),
                        color: activeTable.accent,
                        borderRadius: 3
                      }}
                    >
                      <StorageRoundedIcon sx={{ fontSize: 30 }} />
                    </Avatar>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        {rows.length === 0
                          ? 'No records found'
                          : 'No matching records'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.75, maxWidth: 390 }}
                      >
                        {rows.length === 0
                          ? 'This table is empty, or the database query failed. Check the error message above.'
                          : 'Try another search term or clear your current search.'}
                      </Typography>
                    </Box>

                    {rows.length === 0 && (
                      <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={openCreateDialog}
                        sx={{
                          mt: 1,
                          borderRadius: 2.5,
                          textTransform: 'none',
                          fontWeight: 800,
                          background: gradient
                        }}
                      >
                        Create first record
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <>
                    <TableContainer sx={{ maxHeight: '65vh' }}>
                      <Table
                        stickyHeader
                        size="small"
                        sx={{
                          minWidth: 760,
                          '& th': {
                            bgcolor: 'background.default',
                            color: mutedColor,
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            letterSpacing: '0.045em',
                            whiteSpace: 'nowrap',
                            borderBottom: 1,
                            borderColor: 'divider'
                          },
                          '& td': {
                            borderColor: 'divider',
                            py: 1.4
                          },
                          '& tbody tr:hover': {
                            bgcolor: alpha(activeTable.accent, 0.045)
                          }
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell key={column}>{column}</TableCell>
                            ))}

                            <TableCell
                              align="right"
                              sx={{
                                position: 'sticky',
                                right: 0,
                                zIndex: 3,
                                bgcolor: 'background.default'
                              }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {paginatedRows.map((record, index) => (
                            <TableRow
                              hover
                              key={`${String(
                                record[activeTable.primaryKey] ?? 'row'
                              )}-${index}`}
                            >
                              {columns.map((column) => {
                                const value = record[column];
                                const formatted = formatValue(value);
                                const isObject =
                                  typeof value === 'object' && value !== null;

                                return (
                                  <TableCell
                                    key={column}
                                    sx={{
                                      maxWidth: 320,
                                      minWidth: 100,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <Tooltip title={formatted} enterDelay={500}>
                                      <Box
                                        component="span"
                                        sx={{
                                          display: 'inline-block',
                                          maxWidth: '100%',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          verticalAlign: 'middle',
                                          fontFamily: isObject
                                            ? 'monospace'
                                            : 'inherit',
                                          fontSize: isObject
                                            ? '0.78rem'
                                            : 'inherit',
                                          color:
                                            value === null ||
                                            value === undefined
                                              ? 'text.disabled'
                                              : 'text.primary'
                                        }}
                                      >
                                        {formatted}
                                      </Box>
                                    </Tooltip>
                                  </TableCell>
                                );
                              })}

                              <TableCell
                                align="right"
                                sx={{
                                  position: 'sticky',
                                  right: 0,
                                  bgcolor: 'background.paper',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  sx={{ justifyContent: 'flex-end' }}
                                >
                                  <Tooltip title="Edit record">
                                    <IconButton
                                      size="small"
                                      aria-label="Edit record"
                                      onClick={() => openEditDialog(record)}
                                      sx={{
                                        color: primary,
                                        bgcolor: alpha(primary, 0.07),
                                        borderRadius: 1.75,
                                        '&:hover': {
                                          bgcolor: alpha(primary, 0.15)
                                        }
                                      }}
                                    >
                                      <EditRoundedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Delete record">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      aria-label="Delete record"
                                      onClick={() => setDeleteTarget(record)}
                                      sx={{
                                        bgcolor: alpha(
                                          theme.palette.error.main,
                                          0.06
                                        ),
                                        borderRadius: 1.75,
                                        '&:hover': {
                                          bgcolor: alpha(
                                            theme.palette.error.main,
                                            0.14
                                          )
                                        }
                                      }}
                                    >
                                      <DeleteRoundedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Divider />

                    <TablePagination
                      component="div"
                      count={filteredRows.length}
                      page={page}
                      onPageChange={(_, nextPage) => setPage(nextPage)}
                      rowsPerPage={pageSize}
                      onRowsPerPageChange={(event) => {
                        setPageSize(Number(event.target.value));
                        setPage(0);
                      }}
                      rowsPerPageOptions={PAGE_SIZE_OPTIONS}
                    />
                  </>
                )}
              </Paper>
            )}

            {/* Edit History */}

            <Paper
              variant="outlined"
              sx={{
                mt: 4,
                overflow: 'hidden',
                borderRadius: 3.5,
                borderColor: 'divider',
                bgcolor: customTheme.secondaryScale?.[4]
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between'
                  }}
                  spacing={1.5}
                >
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center' }}
                    spacing={1.5}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        color: primary,
                        bgcolor: alpha(primary, 0.12),
                        border: `1px solid ${alpha(primary, 0.2)}`
                      }}
                    >
                      <HistoryRoundedIcon />
                    </Avatar>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900,
                          letterSpacing: '-0.035em'
                        }}
                      >
                        Edit History
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Recent database changes made during this session.
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    icon={<HistoryRoundedIcon />}
                    label={`${editHistory.length} / 50 events`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 750,
                      borderColor: alpha(primary, 0.25),
                      color: 'text.secondary'
                    }}
                  />
                </Stack>
              </Box>

              <Divider />

              {editHistory.length === 0 ? (
                <Stack
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 3,
                    py: 5,
                    textAlign: 'center'
                  }}
                  spacing={1.5}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 3,
                      color: 'text.secondary',
                      bgcolor: alpha(
                        theme.palette.text.primary,
                        isDark ? 0.08 : 0.045
                      )
                    }}
                  >
                    <HistoryRoundedIcon sx={{ fontSize: 28 }} />
                  </Avatar>

                  <Typography sx={{ fontWeight: 850 }}>
                    No changes yet
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 360 }}
                  >
                    Successful record creations, updates, and deletions will
                    appear here.
                  </Typography>
                </Stack>
              ) : (
                <TableContainer>
                  <Table
                    size="small"
                    sx={{
                      minWidth: { xs: 500, sm: 620 },
                      '& th': {
                        bgcolor: alpha(
                          theme.palette.text.primary,
                          isDark ? 0.035 : 0.025
                        ),
                        color: 'text.secondary',
                        fontWeight: 850,
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap'
                      },
                      '& td': {
                        py: 1.5,
                        borderColor: 'divider'
                      },
                      '& tbody tr:last-child td': {
                        borderBottom: 0
                      }
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Action</TableCell>
                        <TableCell>Table</TableCell>
                        <TableCell>Record ID</TableCell>
                        <TableCell>Timestamp</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {editHistory.map((entry) => {
                        const actionColor =
                          entry.action === 'CREATE'
                            ? '#34D399'
                            : entry.action === 'UPDATE'
                              ? '#60A5FA'
                              : theme.palette.error.main;

                        return (
                          <TableRow key={entry.id} hover>
                            <TableCell>
                              <Chip
                                label={entry.action}
                                size="small"
                                sx={{
                                  height: 25,
                                  fontWeight: 900,
                                  fontSize: '0.68rem',
                                  letterSpacing: '0.025em',
                                  color: actionColor,
                                  bgcolor: alpha(actionColor, 0.12),
                                  border: `1px solid ${alpha(actionColor, 0.22)}`
                                }}
                              />
                            </TableCell>

                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 750,
                                  fontFamily: 'monospace',
                                  fontSize: '0.78rem',
                                  overflowWrap: 'anywhere'
                                }}
                              >
                                {entry.table}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.78rem',
                                  overflowWrap: 'anywhere'
                                }}
                              >
                                {entry.recordId}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Tooltip
                                title={new Date(
                                  entry.timestamp
                                ).toLocaleString()}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: '0.78rem',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {new Date(entry.timestamp).toLocaleString()}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Divider />

              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Showing the 50 most recent successful changes. This history
                  resets when the page is reloaded or the dashboard session
                  ends.
                </Typography>
              </Box>
            </Paper>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ justifyContent: 'space-between', mt: 3, pb: 2 }}
              spacing={1}
            >
              <Stack
                direction="row"
                sx={{ alignItems: 'center' }}
                spacing={0.75}
              >
                <CheckCircleRoundedIcon
                  sx={{ fontSize: 15, color: '#34D399' }}
                />
                <Typography variant="caption" color="text.secondary">
                  Connected to Supabase
                </Typography>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                {activeView === 'overview'
                  ? `${ADMIN_TABLES.length} database tables configured`
                  : `Up to 1,000 records loaded from ${activeTable.name}`}
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* Create / edit record dialog */}

      <Dialog
        open={Boolean(editor)}
        onClose={closeEditor}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 3, sm: 4 },
              overflow: 'hidden'
            }
          }
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            background: `linear-gradient(120deg, ${alpha(primary, 0.12)}, ${alpha(secondary, 0.08)})`
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.5}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: alpha(primary, 0.14),
                color: primary,
                borderRadius: 2.5
              }}
            >
              {editor?.mode === 'create' ? (
                <AddRoundedIcon />
              ) : (
                <EditRoundedIcon />
              )}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {editor?.mode === 'create' ? 'Create record' : 'Edit record'}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ overflowWrap: 'anywhere' }}
              >
                {activeTable.name}
              </Typography>
            </Box>

            <IconButton
              aria-label="Close editor"
              onClick={closeEditor}
              disabled={saving}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2.5 }}>
            {editor?.mode === 'create'
              ? 'Fill in the fields for your new record. Field names must match your database column names exactly. Generated fields, such as an automatically generated ID, are omitted.'
              : 'Update the fields you want to change. The primary key is read-only and will not be updated.'}
          </Alert>

          {editorError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>
              {editorError}
            </Alert>
          )}

          {editor && (
            <Stack spacing={2.25}>
              {Object.entries(editor.record).map(([key, value]) => {
                const fieldType = fieldTypes[key] ?? 'text';
                const isPrimaryKey =
                  key === activeTable.primaryKey && editor.mode === 'edit';

                return (
                  <Box key={key}>
                    {fieldType === 'boolean' ? (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          borderColor: 'divider'
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={value === true}
                              onChange={(event) =>
                                updateEditorField(key, event.target.checked)
                              }
                              disabled={saving || isPrimaryKey}
                            />
                          }
                          label={
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 800 }}
                              >
                                {key}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Boolean · {value === true ? 'True' : 'False'}
                              </Typography>
                            </Box>
                          }
                          sx={{ ml: 0, mr: 0 }}
                        />
                      </Paper>
                    ) : fieldType === 'json' ? (
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={12}
                        label={key}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(event) =>
                          updateEditorField(key, event.target.value)
                        }
                        disabled={saving || isPrimaryKey}
                        spellCheck={false}
                        placeholder={'{\n  "example": "value"\n}'}
                        helperText={
                          isPrimaryKey
                            ? 'Primary key — read-only'
                            : 'Enter a valid JSON object, array, string, number, boolean, or null.'
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            alignItems: 'flex-start',
                            borderRadius: 2.5
                          },
                          '& textarea': {
                            fontFamily:
                              '"Cascadia Code", "Fira Code", monospace',
                            fontSize: 13,
                            lineHeight: 1.75,
                            tabSize: 2
                          }
                        }}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label={key}
                        value={
                          value === null || value === undefined
                            ? ''
                            : String(value)
                        }
                        onChange={(event) =>
                          updateEditorField(key, event.target.value)
                        }
                        disabled={saving || isPrimaryKey}
                        type={fieldType === 'number' ? 'number' : 'text'}
                        multiline={
                          fieldType === 'text' && String(value).length > 100
                        }
                        minRows={
                          fieldType === 'text' && String(value).length > 100
                            ? 3
                            : undefined
                        }
                        slotProps={{
                          htmlInput:
                            fieldType === 'number' ? { step: 'any' } : undefined
                        }}
                        helperText={
                          isPrimaryKey
                            ? 'Primary key — read-only'
                            : fieldType === 'number'
                              ? 'Number'
                              : undefined
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2.5
                          }
                        }}
                      />
                    )}
                  </Box>
                );
              })}

              {Object.keys(editor.record).length === 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    borderStyle: 'dashed',
                    textAlign: 'center'
                  }}
                >
                  <Typography sx={{ fontWeight: 800 }}>
                    No fields added yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                  >
                    Add a field below using an exact column name from your
                    Supabase table.
                  </Typography>
                </Paper>
              )}

              <Divider />

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1.25, fontWeight: 900 }}
                >
                  Add field
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.25}
                  sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label="Column name"
                    placeholder="e.g. display_name"
                    value={newFieldName}
                    onChange={(event) => setNewFieldName(event.target.value)}
                    disabled={saving}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addEditorField();
                      }
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                    }}
                  />

                  <TextField
                    select
                    size="small"
                    label="Field type"
                    value={newFieldType}
                    onChange={(event) =>
                      setNewFieldType(event.target.value as FormFieldType)
                    }
                    disabled={saving}
                    sx={{
                      minWidth: { xs: '100%', sm: 150 },
                      '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
                    }}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </TextField>

                  <Button
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={addEditorField}
                    disabled={saving}
                    sx={{
                      minHeight: 40,
                      borderRadius: 2.5,
                      textTransform: 'none',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    Add field
                  </Button>
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Only add columns that actually exist in the selected database
                  table. The database will reject unknown column names.
                </Typography>
              </Box>

              {Object.keys(editor.record).length > 0 && (
                <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setEditor((current) => {
                        if (!current) return current;

                        const nextRecord = { ...current.record };
                        const nextTypes = { ...fieldTypes };

                        Object.keys(nextRecord).forEach((key) => {
                          if (
                            key !== activeTable.primaryKey ||
                            current.mode !== 'edit'
                          ) {
                            delete nextRecord[key];
                            delete nextTypes[key];
                          }
                        });

                        setFieldTypes(nextTypes);

                        return {
                          ...current,
                          record: nextRecord
                        };
                      });
                      setEditorError('');
                    }}
                    disabled={saving}
                    sx={{ textTransform: 'none' }}
                  >
                    Clear editable fields
                  </Button>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Button onClick={closeEditor} disabled={saving}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => void saveRecord()}
            disabled={saving || !editor}
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : editor?.mode === 'create' ? (
                <AddRoundedIcon />
              ) : (
                <CheckCircleRoundedIcon />
              )
            }
            sx={{
              px: 2.5,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 850,
              background: gradient
            }}
          >
            {saving
              ? 'Saving...'
              : editor?.mode === 'create'
                ? 'Create record'
                : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!saving) setDeleteTarget(null);
        }}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4
            }
          }
        }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 52,
              height: 52,
              mb: 2,
              color: theme.palette.error.main,
              bgcolor: alpha(theme.palette.error.main, 0.12),
              borderRadius: 3
            }}
          >
            <DeleteRoundedIcon />
          </Avatar>

          <Typography
            variant="h5"
            sx={{ fontWeight: 950, letterSpacing: '-0.045em' }}
          >
            Delete this record?
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1.25, lineHeight: 1.7 }}>
            This permanently deletes the selected record from{' '}
            <Box component="strong" sx={{ color: headingColor }}>
              {activeTable.name}
            </Box>
            . This action cannot be undone.
          </Typography>

          {deleteTarget && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2.5,
                p: 1.75,
                borderRadius: 2.5,
                borderColor: alpha(theme.palette.error.main, 0.25),
                bgcolor: alpha(theme.palette.error.main, 0.035),
                overflowWrap: 'anywhere'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {activeTable.primaryKey}
              </Typography>
              <Typography sx={{ fontWeight: 850, mt: 0.25 }}>
                {formatValue(deleteTarget[activeTable.primaryKey])}
              </Typography>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={saving}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => void deleteRecord()}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteRoundedIcon />
              )
            }
            sx={{
              borderRadius: 2,
              px: 2,
              textTransform: 'none',
              fontWeight: 850
            }}
          >
            {saving ? 'Deleting...' : 'Delete permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
