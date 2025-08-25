"use client";
import {useState} from "react";
import {Modal, ModalClose, ModalDialog, Box, Button} from "@mui/joy";
import {StyledInput, StyledButton, Title} from "@/components";
import {api} from "@/lib/axios";
import Swal from "sweetalert2";

interface ModalCreateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pathname: string;
  title: string;
}

const ModalCreateEntity: React.FC<ModalCreateProps> = ({
  open,
  onClose,
  onSuccess,
  pathname,
  title,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire({
        title: "Error",
        text: `Nama ${title.toLowerCase()} harus diisi`,
        icon: "error",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post(pathname, formData);

      Swal.fire({
        title: "Berhasil",
        text: `${title} berhasil ditambahkan`,
        icon: "success",
      });

      setFormData({name: ""});
      onSuccess();
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Gagal menambahkan ${title.toLowerCase()}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          maxWidth: 500,
          width: "100%",
          padding: 3,
        }}
      >
        <ModalClose />
        <Title>Tambah {title} Baru</Title>

        <form className="mt-2" onSubmit={handleSubmit}>
          <StyledInput
            label={`Nama ${title}`}
            name="name"
            placeholder={`Masukkan nama ${title.toLowerCase()}`}
            value={formData.name}
            onChange={handleChange}
            required
            size="sm"
            sx={{mb: 3}}
          />

          <Box sx={{display: "flex", gap: 2, justifyContent: "flex-end"}}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <StyledButton
              type="submit"
              loading={loading}
              disabled={loading || formData.name.trim() === ""}
            >
              Simpan
            </StyledButton>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ModalCreateEntity;
