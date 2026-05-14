import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, title, children, actions, maxWidth = 'sm' }) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={maxWidth}
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 },
            transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
            sx: {
              bgcolor: '#1a1a24',
              border: '1px solid #2e2e45',
              borderRadius: 4,
              backgroundImage: 'none',
            },
          }}
          BackdropProps={{
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          {title && (
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                {title}
              </Box>
              <IconButton onClick={onClose} size="small">
                <X size={20} />
              </IconButton>
            </DialogTitle>
          )}
          <DialogContent>{children}</DialogContent>
          {actions && <DialogActions sx={{ p: 3, pt: 2 }}>{actions}</DialogActions>}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
