import { useState } from 'react';
import { Card, CardContent, Typography, TextField, IconButton, Box, Chip } from '@mui/material';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIContentPanel({ content }) {
  const [copied, setCopied] = useState({});
  const [editedContent, setEditedContent] = useState({
    seoDescription: content?.seoDescription || '',
    instagramCaption: content?.instagramCaption || '',
    facebookPost: content?.facebookPost || '',
  });

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    toast.success('Copied to clipboard!');
    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 2000);
  };

  const ContentSection = ({ title, value, fieldKey }) => (
    <Card
      sx={{
        mb: 2,
        border: '1px solid #2e2e45',
        background: '#252535',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => copyToClipboard(editedContent[fieldKey], fieldKey)}
            sx={{ color: copied[fieldKey] ? 'success.main' : 'text.secondary' }}
          >
            {copied[fieldKey] ? <Check size={18} /> : <Copy size={18} />}
          </IconButton>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={editedContent[fieldKey]}
          onChange={(e) =>
            setEditedContent({ ...editedContent, [fieldKey]: e.target.value })
          }
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#1a1a24',
            },
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <ContentSection
        title="SEO Description"
        value={content?.seoDescription}
        fieldKey="seoDescription"
      />

      <Card
        sx={{
          mb: 2,
          border: '1px solid #2e2e45',
          background: '#252535',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Hashtags
            </Typography>
            <IconButton
              size="small"
              onClick={() =>
                copyToClipboard(content?.hashtags?.join(' ') || '', 'hashtags')
              }
              sx={{ color: copied.hashtags ? 'success.main' : 'text.secondary' }}
            >
              {copied.hashtags ? <Check size={18} /> : <Copy size={18} />}
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {content?.hashtags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.12)',
                  color: '#a5b4fc',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <ContentSection
        title="Instagram Caption"
        value={content?.instagramCaption}
        fieldKey="instagramCaption"
      />

      <ContentSection
        title="Facebook Post"
        value={content?.facebookPost}
        fieldKey="facebookPost"
      />
    </Box>
  );
}
