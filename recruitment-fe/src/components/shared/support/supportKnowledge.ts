import type { User } from '@/modules/user/hooks/useUser';

export type SupportTopic = {
  id: string;
  label: string;
  roles: Array<'PUBLIC' | 'CANDIDATE' | 'EMPLOYER'>;
  answer: (user?: User) => string;
};

export const supportTopics: SupportTopic[] = [
  {
    id: 'apply-job',
    label: 'Cách ứng tuyển',
    roles: ['PUBLIC', 'CANDIDATE'],
    answer: () =>
      'Bạn mở chi tiết việc làm, bấm Ứng tuyển, chọn CV đã tải lên rồi gửi đơn. Nếu chưa đăng nhập hoặc chưa có CV, hệ thống sẽ yêu cầu hoàn tất bước đó trước.',
  },
  {
    id: 'saved-jobs',
    label: 'Việc đã lưu',
    roles: ['PUBLIC', 'CANDIDATE'],
    answer: () =>
      'Bạn bấm biểu tượng trái tim trên tin tuyển dụng để lưu. Sau khi đăng nhập, danh sách nằm ở mục Việc làm đã lưu.',
  },
  {
    id: 'resumes',
    label: 'Quản lý CV',
    roles: ['PUBLIC', 'CANDIDATE'],
    answer: () =>
      'Vào mục CV của tôi để tải CV PDF/DOC/DOCX, đặt CV mặc định và dùng CV đó khi ứng tuyển.',
  },
  {
    id: 'applications',
    label: 'Theo dõi đơn',
    roles: ['CANDIDATE'],
    answer: () =>
      'Vào Đơn ứng tuyển để xem trạng thái. Các trạng thái thường gặp gồm PENDING, REVIEWING, INTERVIEW, ACCEPTED, REJECTED hoặc WITHDRAWN.',
  },
  {
    id: 'company-status',
    label: 'Trạng thái công ty',
    roles: ['EMPLOYER'],
    answer: (user) => {
      if (!user?.companyId) {
        return 'Tài khoản employer của bạn chưa có công ty. Hãy vào bước thiết lập doanh nghiệp để tạo hồ sơ hoặc gửi yêu cầu gia nhập bằng mã số thuế.';
      }
      if (user.companyStatus === 'PENDING') {
        return 'Hồ sơ công ty đang chờ admin duyệt. Trong thời gian này bạn chưa nên đăng tin chính thức.';
      }
      if (user.companyStatus === 'REJECTED') {
        return 'Hồ sơ công ty đã bị từ chối. Chủ sở hữu có thể kiểm tra lại thông tin và tạo lại hồ sơ.';
      }
      if (user.companyStatus === 'BLACKLIST') {
        return 'Công ty đang bị chặn do vi phạm quy định. Bạn cần liên hệ bộ phận hỗ trợ để được xem xét.';
      }
      return 'Công ty đã được xác minh. Bạn có thể đăng tin, quản lý ứng viên, lịch phỏng vấn và phân công HR.';
    },
  },
  {
    id: 'post-job',
    label: 'Đăng tin tuyển dụng',
    roles: ['EMPLOYER'],
    answer: (user) =>
      user?.companyStatus === 'VERIFIED'
        ? 'Vào Tin tuyển dụng, chọn tạo tin mới, nhập đầy đủ mô tả, yêu cầu, lương, địa điểm và gửi admin duyệt.'
        : 'Bạn chỉ nên đăng tin sau khi công ty được xác minh. Hiện trạng thái công ty của bạn chưa phải VERIFIED.',
  },
  {
    id: 'assign-hr',
    label: 'Phân công HR',
    roles: ['EMPLOYER'],
    answer: (user) =>
      user?.isOwner
        ? 'Chủ sở hữu có thể vào Quản lý nhân sự để duyệt thành viên HR, sau đó phân công HR vào từng tin tuyển dụng.'
        : 'Chỉ chủ sở hữu công ty mới có quyền duyệt thành viên và phân công HR.',
  },
  {
    id: 'interviews',
    label: 'Lịch phỏng vấn',
    roles: ['CANDIDATE', 'EMPLOYER'],
    answer: () =>
      'Lịch phỏng vấn được tạo từ quy trình xử lý đơn ứng tuyển. Ứng viên có thể xác nhận hoặc từ chối lịch, employer có thể theo dõi trong mục lịch phỏng vấn.',
  },
];

export const getSupportRole = (user?: User) => {
  if (!user) return 'PUBLIC';
  if (user.role === 'EMPLOYER') return 'EMPLOYER';
  if (user.role === 'CANDIDATE') return 'CANDIDATE';
  return 'PUBLIC';
};
