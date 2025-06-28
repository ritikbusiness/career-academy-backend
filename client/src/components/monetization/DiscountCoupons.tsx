import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, Edit, Trash2, Check, X, Tag, Percent, 
  DollarSign, Calendar, Users, Copy 
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  minOrderAmount?: number;
  applicableCourses?: string[];
  createdBy: string;
  createdAt: string;
}

interface CouponFormData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  expiryDate: string;
  usageLimit: string;
  minOrderAmount: string;
}

interface DiscountCouponsProps {
  userRole: 'instructor' | 'admin';
  userId: string;
}

export default function DiscountCoupons({ userRole, userId }: DiscountCouponsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    type: 'percentage',
    value: 0,
    description: '',
    expiryDate: '',
    usageLimit: '',
    minOrderAmount: ''
  });

  // Mock data
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      description: 'Welcome discount for new students',
      expiryDate: '2025-12-31',
      usageLimit: 100,
      usedCount: 23,
      isActive: true,
      minOrderAmount: 50,
      createdBy: 'admin',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      code: 'SAVE50',
      type: 'fixed',
      value: 50,
      description: 'Fixed $50 discount on premium courses',
      expiryDate: '2025-06-30',
      usageLimit: 200,
      usedCount: 87,
      isActive: true,
      minOrderAmount: 200,
      createdBy: userId,
      createdAt: '2024-02-10'
    },
    {
      id: '3',
      code: 'EXPIRED10',
      type: 'percentage',
      value: 10,
      description: 'Early bird discount',
      expiryDate: '2024-12-31',
      usedCount: 156,
      isActive: false,
      createdBy: userId,
      createdAt: '2024-01-01'
    }
  ]);

  const handleCreateCoupon = () => {
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: formData.value,
      description: formData.description,
      expiryDate: formData.expiryDate,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      usedCount: 0,
      isActive: true,
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
      createdBy: userId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // TODO: connect to backend - create coupon
    setCoupons(prev => [newCoupon, ...prev]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdateCoupon = () => {
    if (!editingCoupon) return;

    const updatedCoupon: Coupon = {
      ...editingCoupon,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: formData.value,
      description: formData.description,
      expiryDate: formData.expiryDate,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
    };

    // TODO: connect to backend - update coupon
    setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? updatedCoupon : c));
    setEditingCoupon(null);
    resetForm();
  };

  const handleDeleteCoupon = (couponId: string) => {
    // TODO: connect to backend - delete coupon
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const handleToggleActive = (couponId: string) => {
    // TODO: connect to backend - toggle coupon status
    setCoupons(prev => prev.map(c => 
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() && 
      c.isActive &&
      new Date(c.expiryDate) > new Date()
    );

    if (coupon) {
      setAppliedCoupon(coupon.code);
      // TODO: connect to backend - apply coupon to cart
    } else {
      // TODO: show error message
      console.log('Invalid or expired coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponCode('');
    // TODO: connect to backend - remove coupon from cart
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      description: '',
      expiryDate: '',
      usageLimit: '',
      minOrderAmount: ''
    });
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description || '',
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit?.toString() || '',
      minOrderAmount: coupon.minOrderAmount?.toString() || ''
    });
  };

  const calculateDiscount = (originalPrice: number, coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return originalPrice * (coupon.value / 100);
    }
    return Math.min(coupon.value, originalPrice);
  };

  const getUsagePercentage = (coupon: Coupon) => {
    if (!coupon.usageLimit) return 0;
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  // Mock cart data for coupon application demo
  const mockCartTotal = 299;
  const appliedCouponData = coupons.find(c => c.code === appliedCoupon);
  const discountAmount = appliedCouponData ? calculateDiscount(mockCartTotal, appliedCouponData) : 0;
  const finalTotal = mockCartTotal - discountAmount;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Student Coupon Application Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Apply Discount Coupon
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!appliedCoupon ? (
            <div className="flex gap-3">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200">
                    Coupon <strong>{appliedCoupon}</strong> applied successfully!
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>${mockCartTotal}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({appliedCouponData?.type === 'percentage' ? `${appliedCouponData.value}%` : `$${appliedCouponData?.value}`}):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Final Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin/Instructor Coupon Management */}
      {(userRole === 'admin' || userRole === 'instructor') && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Coupon Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage discount coupons for your courses
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </div>

          {/* Coupons List */}
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id} className={!coupon.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {coupon.code}
                          </Badge>
                          {coupon.type === 'percentage' ? (
                            <Badge variant="secondary">
                              <Percent className="w-3 h-3 mr-1" />
                              {coupon.value}%
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${coupon.value}
                            </Badge>
                          )}
                          {!coupon.isActive && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                          {new Date(coupon.expiryDate) < new Date() && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {coupon.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Expires:</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {coupon.expiryDate}
                          </div>
                        </div>
                        
                        {coupon.usageLimit && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Usage:</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {coupon.usedCount}/{coupon.usageLimit}
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full transition-all"
                                style={{ width: `${getUsagePercentage(coupon)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {coupon.minOrderAmount && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Min. Order:</span>
                            <div>${coupon.minOrderAmount}</div>
                          </div>
                        )}

                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Created:</span>
                          <div>{coupon.createdAt}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditModal(coupon)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleActive(coupon.id)}
                      >
                        {coupon.isActive ? (
                          <X className="w-4 h-4 text-red-500" />
                        ) : (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Create/Edit Coupon Modal */}
      <Dialog open={showCreateModal || !!editingCoupon} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          setEditingCoupon(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="SAVE20"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Discount Type</Label>
                <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => 
                  setFormData(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">
                  {formData.type === 'percentage' ? 'Percentage' : 'Amount ($)'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  placeholder={formData.type === 'percentage' ? '20' : '50'}
                  value={formData.value || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the coupon"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  placeholder="100"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
              <Input
                id="minOrderAmount"
                type="number"
                placeholder="50"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
              />
            </div>

            <Button 
              onClick={editingCoupon ? handleUpdateCoupon : handleCreateCoupon}
              className="w-full"
            >
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}