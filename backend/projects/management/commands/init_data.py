from django.core.management.base import BaseCommand
from approvals.models import ApprovalFlow, ApprovalNode
from projects.models import ProjectCategory


class Command(BaseCommand):
    help = '初始化默认数据'

    def handle(self, *args, **options):
        self.stdout.write('创建默认审批流程...')

        # 投标提交审批流程
        flow, created = ApprovalFlow.objects.get_or_create(
            code='bid_submit',
            defaults={
                'name': '投标提交审批',
                'flow_type': 'bid_submit',
                'description': '投标文件提交后的审批流程'
            }
        )

        if created:
            # 创建审批节点
            ApprovalNode.objects.create(
                flow=flow,
                name='项目经理审批',
                order=1,
                approver_role='manager',
                is_required=True
            )
            ApprovalNode.objects.create(
                flow=flow,
                name='管理员最终审批',
                order=2,
                approver_role='admin',
                is_required=True
            )
            self.stdout.write(self.style.SUCCESS(f'创建审批流程: {flow.name}'))

        # 项目立项审批流程
        flow2, created2 = ApprovalFlow.objects.get_or_create(
            code='project_approve',
            defaults={
                'name': '项目立项审批',
                'flow_type': 'project_approve',
                'description': '新项目立项审批流程'
            }
        )

        if created2:
            ApprovalNode.objects.create(
                flow=flow2,
                name='部门经理审批',
                order=1,
                approver_role='manager',
                is_required=True
            )
            ApprovalNode.objects.create(
                flow=flow2,
                name='总经理审批',
                order=2,
                approver_role='admin',
                is_required=True
            )
            self.stdout.write(self.style.SUCCESS(f'创建审批流程: {flow2.name}'))

        # 中标确认审批流程
        flow3, created3 = ApprovalFlow.objects.get_or_create(
            code='bid_confirm',
            defaults={
                'name': '中标确认审批',
                'flow_type': 'bid_confirm',
                'description': '中标后的确认审批流程'
            }
        )

        if created3:
            ApprovalNode.objects.create(
                flow=flow3,
                name='项目经理审批',
                order=1,
                approver_role='manager',
                is_required=True
            )
            self.stdout.write(self.style.SUCCESS(f'创建审批流程: {flow3.name}'))

        # 创建默认项目分类
        categories = [
            ('基础设施', 'INFRA', '道路、桥梁、水利等基础设施项目'),
            ('商业', 'COMMERCIAL', '商业综合体、写字楼等商业项目'),
            ('工业', 'INDUSTRIAL', '工厂、产业园等工业项目'),
            ('住宅', 'RESIDENTIAL', '住宅小区、公寓等住宅项目'),
            ('医疗', 'MEDICAL', '医院、医疗机构等医疗项目'),
            ('教育', 'EDUCATION', '学校、培训机构等教育项目'),
        ]

        for name, code, desc in categories:
            ProjectCategory.objects.get_or_create(
                code=code,
                defaults={'name': name, 'description': desc}
            )

        self.stdout.write(self.style.SUCCESS('默认项目分类创建完成'))

        self.stdout.write(self.style.SUCCESS('初始化完成!'))
