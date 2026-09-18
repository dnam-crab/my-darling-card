type InvitationCardProps = {
  title: string;
};

export function InvitationCard({ title }: InvitationCardProps) {
  return (
    <section data-component="invitation-card">
      <h2>{title}</h2>
      <p>Nội dung thiệp và hiệu ứng sẽ được thêm ở bước tiếp theo.</p>
    </section>
  );
}
